import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { Role } from "../roles/roles.model";
import { Subscription } from "./user_follow.model";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Like } from "../like_dis/like.model";
import { Dislike } from "../like_dis/dislike.model";
import { FilesService } from "../files/files.service";

@Injectable()
export default class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Subscription)
        private subscriptionRepository: typeof Subscription,
        @InjectModel(Like)
        private likeRepository: typeof Like,
        @InjectModel(Dislike)
        private dislikeRepository: typeof Dislike,
        private roleService: RolesService,
        private fileService: FilesService
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("User");
        await user.$set("roles", [role.id]);
        user.roles = [role];
        return user;
    }

    async getAllUsers(
        keyword: string,
        placeOfWork: string,
        scienceDegree: string,
        page: number = 1,
        limit: number = 10
    ) {
        try {
            const offset = (page - 1) * limit;
            const whereClause: any = {};
            if (keyword) {
                console.log(keyword);
                whereClause.name = { [Op.iLike]: `%${keyword}%` };
            }
            if (placeOfWork) {
                whereClause.place_of_work = { [Op.iLike]: `%${placeOfWork}%` };
            }
            if (scienceDegree) {
                whereClause.science_degree = {
                    [Op.iLike]: `%${scienceDegree}%`,
                };
            }

            const usersPromise = this.userRepository.findAll({
                where: whereClause,
                attributes: { exclude: ["password"] },
                offset,
                limit,
                include: [{ all: true, attributes: { exclude: ["password"] } }],
            });

            const totalUsersPromise = this.userRepository.count({
                where: whereClause,
            });
            const [users, totalUsers] = await Promise.all([
                usersPromise,
                totalUsersPromise,
            ]);
            const pageCount = Math.ceil(totalUsers / limit);
            return { users, totalUsers, page, pageCount, limit };
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    async getAllUsersByRoleProfessor(
        keyword: string,
        page: number = 1,
        limit: number = 10
    ) {
        const offset = (page - 1) * limit;
        const whereClause = keyword
            ? { name: { [Op.iLike]: `%${keyword}%` } }
            : {};
        const users = await this.userRepository.findAll({
            where: whereClause,
            attributes: { exclude: ["password"] },
            offset,
            limit,
            include: {
                model: Role,
                attributes: [],
                where: { value: "Professor" },
            },
        });
        const totalUsers = await this.userRepository.count({
            where: whereClause,
            include: {
                model: Role,
                where: { value: "Professor" },
            },
        });
        const pageCount = Math.ceil(totalUsers / limit);
        return { users, totalUsers, page, pageCount, limit };
    }

    async getMyProject(req: any) {
        try {
            const userId = req.user.id;
            const user = await this.userRepository.findByPk(userId, {
                attributes: { exclude: ["password"] },
                include: [{ all: true, attributes: { exclude: ["password"] } }],
            });

            if (user) {
                return {
                    portfolio: user.postfolio ? user.postfolio : [],
                    course: user.course ? user.course : [],
                };
            } else {
                throw new HttpException(
                    "Пользователь не найден",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            console.error(error);
            throw new HttpException(
                "Ошибка при получении портфолио пользователя",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateUser(
        req: any,
        updateUserDto: Partial<UpdateUserDto>,
        avatar: any
    ) {
        try {
            const userTock = req.user;
            // const user = await this.userRepository.findByPk(userTock.id);
            const user = await this.userRepository.findOne({
                where: { id: userTock.id },
                attributes: { exclude: ["password"] },
                include: [{ all: true, attributes: { exclude: ["password"] } }],
            });
            if (user) {
                if (avatar) {
                    const fileName = await this.fileService.createFile(avatar);
                    updateUserDto.avatar = fileName;
                }
                await user.update(updateUserDto);
                return user;
            } else {
                throw new HttpException(
                    "пользователь не найден",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteUserById(userId: number) {
        const user = await this.userRepository.findByPk(userId);
        if (!user) {
            throw new HttpException(
                "Пользователь не найден",
                HttpStatus.NOT_FOUND
            );
        }
        await user.destroy();
        return { success: true, message: "Пользователь успешно удален" };
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            attributes: { exclude: ["password"] },
            include: [{ all: true, attributes: { exclude: ["password"] } }],
        });
        return user;
    }

    async getProfile(req: any) {
        try {
            const userId = req.user.id;
            const user = await this.userRepository.findByPk(userId, {
                attributes: { exclude: ["password"] },
                include: [{ all: true, attributes: { exclude: ["password"] } }],
            });
            return user;
        } catch (error) {
            console.log("тут ошибка");
        }
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add("role", role.id);
            return dto;
        }
        throw new HttpException("User or role not found", HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException("User is not found", HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }

    async getAllCourseByAuthorId(authorId: number) {
        const user = await this.userRepository.findByPk(authorId, {
            include: { all: true },
        });
        return user?.course || [];
    }

    async subscribe(subscriberId: number, authorId: number) {
        const author = await this.userRepository.findByPk(authorId);
        const subscriber = await this.userRepository.findByPk(subscriberId);
        if (author && subscriber) {
            if (subscriberId != authorId) {
                await this.subscriptionRepository.create({
                    subscriberId,
                    authorId,
                } as Subscription);
                return { success: true, message: "Подписка прошла успешно" };
            } else {
                throw new HttpException(
                    "you can't subscribe to yourself",
                    HttpStatus.NOT_FOUND
                );
            }
        } else {
            throw new HttpException("User is not found", HttpStatus.NOT_FOUND);
        }
    }

    async unsubscribe(subscriberId: number, authorId: number) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { subscriberId, authorId },
        });
        if (subscription) {
            await this.subscriptionRepository.destroy({
                where: { subscriberId, authorId },
            });
            return { success: true, message: "Отписка прошла успешно" };
        } else {
            throw new HttpException(
                "you are not subscribed",
                HttpStatus.NOT_FOUND
            );
        }
    }

    async getSubscriptions(userId: number) {
        const subscriptions = await this.subscriptionRepository.findAll({
            where: { subscriberId: userId },
            include: { model: User, as: "author", attributes: ["id", "email"] },
        });
        return subscriptions.map((subscription) => subscription.author);
    }

    async getSubscribers(userId: number) {
        const subscribers = await this.subscriptionRepository.findAll({
            where: { authorId: userId },
            include: {
                model: User,
                as: "subscriber",
                attributes: ["id", "email"],
            },
        });
        return subscribers.map((subscription) => subscription.subscriber);
    }

    async checkSubscription(
        subscriberId: number,
        authorId: number
    ): Promise<boolean> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { subscriberId, authorId },
        });

        return !!subscription;
    }
    //Функционал лайков и дизлайков
    async like(userId: number, likedUserId: number) {
        const user = await this.userRepository.findByPk(userId);
        const likedUser = await this.userRepository.findByPk(likedUserId);

        if (!user || !likedUser) {
            throw new HttpException(
                "User or liked user not found",
                HttpStatus.NOT_FOUND
            );
        } else {
            const existingLike = await this.likeRepository.findOne({
                where: { userId, likedUserId },
            });
            if (existingLike) {
                throw new HttpException(
                    "already worth a like",
                    HttpStatus.NOT_FOUND
                );
            } else {
                const dislikedUserId = likedUserId;
                const existingDislike = await this.dislikeRepository.findOne({
                    where: { userId, dislikedUserId },
                });
                if (existingDislike) {
                    await this.undislike(userId, dislikedUserId);
                }
                await this.likeRepository.create({
                    userId,
                    likedUserId,
                });
                await likedUser.increment("likes");
                return { success: true, message: "лайк поставлен" };
            }
        }
    }

    async unlike(userId: number, likedUserId: number) {
        const user = await this.userRepository.findByPk(userId);
        const likedUser = await this.userRepository.findByPk(likedUserId);

        if (!user || !likedUser) {
            throw new HttpException(
                "User or liked user not found",
                HttpStatus.NOT_FOUND
            );
        } else {
            const existingLike = await this.likeRepository.findOne({
                where: { userId, likedUserId },
            });
            if (existingLike) {
                await this.likeRepository.destroy({
                    where: { userId, likedUserId },
                });
                await likedUser.decrement("likes");
                return { success: true, message: "лайк удален" };
            } else {
                throw new HttpException(
                    "liked user not found",
                    HttpStatus.NOT_FOUND
                );
            }
        }
    }

    async getUsersLikedBy(userId: number): Promise<User[]> {
        const likes = await this.likeRepository.findAll({
            where: { userId },
        });
        const likedUserIds = likes.map((like) => like.likedUserId);
        return this.userRepository.findAll({
            where: {
                id: likedUserIds,
            },
        });
    }

    async dislike(userId: number, dislikedUserId: number) {
        const user = await this.userRepository.findByPk(userId);
        const dislikedUser = await this.userRepository.findByPk(dislikedUserId);

        if (!user || !dislikedUser) {
            throw new HttpException(
                "User or disliked user not found",
                HttpStatus.NOT_FOUND
            );
        } else {
            const existingDislike = await this.dislikeRepository.findOne({
                where: { userId, dislikedUserId },
            });
            if (existingDislike) {
                throw new HttpException(
                    "there's already a dislike",
                    HttpStatus.NOT_FOUND
                );
            } else {
                const likedUserId = dislikedUserId;
                const existingLike = await this.likeRepository.findOne({
                    where: { userId, likedUserId },
                });
                if (existingLike) {
                    await this.unlike(userId, likedUserId);
                }
                await this.dislikeRepository.create({
                    userId,
                    dislikedUserId,
                });
                await dislikedUser.increment("dislikes");
                return { success: true, message: "дислайк поставлен" };
            }
        }
    }

    async undislike(userId: number, dislikedUserId: number) {
        const user = await this.userRepository.findByPk(userId);
        const dislikedUser = await this.userRepository.findByPk(dislikedUserId);
        if (!user || !dislikedUser) {
            throw new HttpException(
                "User or disliked user not found",
                HttpStatus.NOT_FOUND
            );
        } else {
            const existingDislike = await this.dislikeRepository.findOne({
                where: { userId, dislikedUserId },
            });
            if (existingDislike) {
                await this.dislikeRepository.destroy({
                    where: { userId, dislikedUserId },
                });
                await dislikedUser.decrement("dislikes");
                return { success: true, message: "дислайк удален" };
            } else {
                throw new HttpException(
                    "disliked user not found",
                    HttpStatus.NOT_FOUND
                );
            }
        }
    }

    async getUsersDislikedBy(userId: number): Promise<User[]> {
        const dislikes = await this.dislikeRepository.findAll({
            where: { userId },
        });

        const dislikedUserIds = dislikes.map(
            (dislike) => dislike.dislikedUserId
        );

        return this.userRepository.findAll({
            where: {
                id: dislikedUserIds,
            },
        });
    }
}

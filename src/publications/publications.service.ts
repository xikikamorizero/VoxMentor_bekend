import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePublicationsDto } from "./dto/create-publications.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Publications } from "./publications.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { error } from "console";
import { EditPublicationsDto } from "./dto/update-publications.dto";
import { User } from "src/users/users.model";

@Injectable()
export class PublicationsService {
    constructor(
        @InjectModel(Publications)
        private publicationsRepository: typeof Publications,
        @InjectModel(User) private userRepository: typeof User,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreatePublicationsDto, image: any, docs: any) {
        try {
            const User = await this.userRepository.findByPk(req.user.id);
            if (User) {
                dto.userId = User.id;

                let fileDocsName = null;
                if (docs) {
                    fileDocsName = await this.fileService.createFile(docs);
                }
                const pub = await this.publicationsRepository.create({
                    ...dto,
                    docs: fileDocsName,
                });
                await User.increment("publicationsCount");

                return pub;
            } else {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllAwardByUserId(
        req: any,
        authorId: number,
        page: number = 1,
        limit: number = 10
    ) {
        const user = req.user;
        if (user.id == authorId) {
            const offset = (page - 1) * limit;
            const pub = await this.publicationsRepository.findAll({
                where: {
                    userId: authorId,
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.publicationsRepository.count({
                where: {
                    userId: authorId,
                },
            });
            const pageCount = Math.ceil(totalCourses / limit);
            return { pub, totalCourses, page, pageCount, limit };
        } else {
            throw error;
        }
    }

    async getAwardById(id: number) {
        const pub = await this.publicationsRepository.findOne({
            where: { id },
            include: { all: true },
        });
        if (pub) {
            return pub;
        } else {
            throw new HttpException("Награда не найдена", HttpStatus.NOT_FOUND);
        }
    }

    async update(
        req: any,
        awardId: number,
        updatePubDto: Partial<EditPublicationsDto>,
        docs: any
    ) {
        try {
            const pub = await this.publicationsRepository.findByPk(awardId);
            if (pub) {
                const user = req.user;
                if (pub.userId == user.id) {
                    let fileDocsName = pub.docs;
                    if (docs) {
                        fileDocsName = await this.fileService.createFile(docs);
                    }
                    await pub.update({
                        ...updatePubDto,
                        docs: fileDocsName,
                    });
                    return pub;
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.NOT_FOUND
                    );
                }
            } else {
                throw new HttpException(
                    "Награда не найдена",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteById(req: any, awardId: number) {
        try {
            const award = await this.publicationsRepository.findByPk(awardId);
            if (award) {
                const User = await this.userRepository.findByPk(req.user.id);
                if (award.userId === User.id && User) {
                    if (award.docs) {
                        await this.fileService.deleteFile(award.docs);
                    }
                    await award.destroy();
                    await User.decrement("publicationsCount");
                    return {
                        success: true,
                    };
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором награды",
                        HttpStatus.FORBIDDEN
                    );
                }
            } else {
                throw new HttpException(
                    "награда не найдена",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw new HttpException(
                "Ошибка при удалении награды",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

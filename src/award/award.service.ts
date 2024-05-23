import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAwardDto } from "./dto/create-award.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Award } from "./award.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { Op } from "sequelize";
import { error } from "console";
import { EditAwardDto } from "./dto/update-award.dto";
import { User } from "src/users/users.model";

@Injectable()
export class AwardService {
    constructor(
        @InjectModel(Award) private awardRepository: typeof Award,
        @InjectModel(User) private userRepository: typeof User,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreateAwardDto, image: any, docs: any) {
        try {
            const User = await this.userRepository.findByPk(req.user.id);
            if (User) {
                dto.userId = User.id;
                let fileName = null;
                if (image) {
                    fileName = await this.fileService.createFile(image);
                }

                let fileDocsName = null;
                if (docs) {
                    fileDocsName = await this.fileService.createFile(docs);
                }

                const award = await this.awardRepository.create({
                    ...dto,
                    image: fileName,
                    docs: fileDocsName,
                });
                await User.increment("awardsCount");

                return award;
            } else {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllAwardByUserId(
        req: any,
        authorId: string,
        page: number = 1,
        limit: number = 10
    ) {
        const user = req.user;
        if (user.id == authorId) {
            const offset = (page - 1) * limit;
            const courses = await this.awardRepository.findAll({
                where: {
                    userId: authorId,
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.awardRepository.count({
                where: {
                    userId: authorId,
                },
            });
            const pageCount = Math.ceil(totalCourses / limit);
            return { courses, totalCourses, page, pageCount, limit };
        } else {
            throw error;
        }
    }

    async getAwardById(id: number) {
        const portfolio = await this.awardRepository.findOne({
            where: { id },
            include: { all: true },
        });
        if (portfolio) {
            return portfolio;
        } else {
            throw new HttpException("Награда не найдена", HttpStatus.NOT_FOUND);
        }
    }

    async updateAward(
        req: any,
        awardId: number,
        updatePortfolioDto: Partial<EditAwardDto>,
        image: any,
        docs: any
    ) {
        try {
            const award = await this.awardRepository.findByPk(awardId);
            if (award) {
                const user = req.user;
                if (award.userId == user.id) {
                    let fileName = award.image;
                    if (image) {
                        fileName = await this.fileService.createFile(image);
                    }

                    let fileDocsName = award.docs;
                    if (docs) {
                        fileDocsName = await this.fileService.createFile(docs);
                    }
                    await award.update({
                        ...updatePortfolioDto,
                        image: fileName,
                        docs: fileDocsName,
                    });
                    return award;
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

    async deleteAwardById(req: any, awardId: number) {
        try {
            const award = await this.awardRepository.findByPk(awardId);
            if (award) {
                const User = await this.userRepository.findByPk(req.user.id);
                if (award.userId === User.id && User) {
                    if (award.image) {
                        await this.fileService.deleteFile(award.image);
                    }
                    if (award.docs) {
                        await this.fileService.deleteFile(award.docs);
                    }
                    await award.destroy();
                    await User.decrement("awardsCount");
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

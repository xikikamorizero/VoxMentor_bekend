import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateEducationDto } from "./dto/create-education.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Education } from "./education.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { Op } from "sequelize";
import { error } from "console";
import { EditEducationDto } from "./dto/update-education.dto";

@Injectable()
export class EducationService {
    constructor(
        @InjectModel(Education) private awardRepository: typeof Education,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreateEducationDto, image: any, docs: any) {
        try {
            const user = req.user;
            dto.userId = user.id;

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

            return award;
        } catch (error) {
            throw error;
        }
    }

    async getAllByUserId(
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
            throw new HttpException(
                "Награда не найдена",
                HttpStatus.NOT_FOUND
            );
        }
    }

    async update(
        req: any,
        awardId: number,
        updateDto: Partial<EditEducationDto>,
        image: any,
        docs: any
    ) {
        try {
            const award = await this.awardRepository.findByPk(
                awardId
            );
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
                        ...updateDto,
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

    async deleteById(req: any, awardId: number) {
        try {
            const award = await this.awardRepository.findByPk(
                awardId
            );
            if (award) {
                const user = req.user;
                if (award.userId === user.id) {
                    if (award.image) {
                        await this.fileService.deleteFile(award.image);
                    }
                    if (award.docs) {
                        await this.fileService.deleteFile(award.docs);
                    }
                    await award.destroy();
                    return {
                        success: true
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

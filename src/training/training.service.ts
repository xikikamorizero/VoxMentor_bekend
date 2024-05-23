import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTraningDto } from "./dto/create-award.dto";
import { EditTraningDto } from "./dto/update-award.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Traning } from "./training.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { error } from "console";

@Injectable()
export class TraningService {
    constructor(
        @InjectModel(Traning) private traningRepository: typeof Traning,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreateTraningDto, image: any, docs: any) {
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

            const traning = await this.traningRepository.create({
                ...dto,
                image: fileName,
                docs: fileDocsName,
            });

            return traning;
        } catch (error) {
            throw error;
        }
    }

    async getAllByUserId(
        req: any,
        authorId: number,
        page: number = 1,
        limit: number = 50
    ) {
        const user = req.user;
        if (user.id == authorId) {
            const offset = (page - 1) * limit;
            const traning = await this.traningRepository.findAll({
                where: {
                    userId: authorId,
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.traningRepository.count({
                where: {
                    userId: authorId,
                },
            });
            const pageCount = Math.ceil(totalCourses / limit);
            return { traning, totalCourses, page, pageCount, limit };
        } else {
            throw error;
        }
    }

    async getAwardById(id: number) {
        const traning = await this.traningRepository.findOne({
            where: { id },
            include: { all: true },
        });
        if (traning) {
            return traning;
        } else {
            throw new HttpException(
                "не найдена",
                HttpStatus.NOT_FOUND
            );
        }
    }

    async updateAward(
        req: any,
        awardId: number,
        updateDto: Partial<EditTraningDto>,
        image: any,
        docs: any
    ) {
        try {
            const traning = await this.traningRepository.findByPk(
                awardId
            );
            if (traning) {
                const user = req.user;
                if (traning.userId == user.id) {
                    // let fileName = traning.image;
                    // if (image) {
                    //     fileName = await this.fileService.createFile(image);
                    // }

                    let fileDocsName = traning.docs;
                    if (docs) {
                        fileDocsName = await this.fileService.createFile(docs);
                    }
                    await traning.update({
                        ...updateDto,
                        // image: fileName,
                        docs: fileDocsName,
                    });
                    return traning;
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.NOT_FOUND
                    );
                }
            } else {
                throw new HttpException(
                    "не найдена",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteById(req: any, id: number) {
        try {
            const traning = await this.traningRepository.findByPk(
                id
            );
            if (traning) {
                const user = req.user;
                if (traning.userId === user.id) {
                    // if (traning.image) {
                    //     await this.fileService.deleteFile(traning.image);
                    // }
                    if (traning.docs) {
                        await this.fileService.deleteFile(traning.docs);
                    }
                    await traning.destroy();
                    return {
                        success: true
                    };
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.FORBIDDEN
                    );
                }
            } else {
                throw new HttpException(
                    "не найдена",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw new HttpException(
                "Ошибка при удалении",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

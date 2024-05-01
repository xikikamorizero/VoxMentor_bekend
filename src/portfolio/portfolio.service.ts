import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Portfolio } from "./portfolio.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { Op } from "sequelize";

@Injectable()
export class PortfolioService {
    constructor(
        @InjectModel(Portfolio) private portfolioRepository: typeof Portfolio,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreatePortfolioDto, image: any, docs: any) {
        try {
            const user = req.user;
            dto.userId = user.id;
            console.log(user);

            let fileName = null;
            if (image) {
                fileName = await this.fileService.createFile(image);
            }

            let fileDocsName = null;
            if (docs) {
                fileDocsName = await this.fileService.createFile(docs);
            }

            const portfolio = await this.portfolioRepository.create({
                ...dto,
                image: fileName,
                docs: fileDocsName,
            });

            return portfolio;
        } catch (error) {
            console.log("что-то пошло не так", error);
            throw error;
        }
    }

    async getAllPortfolio(
        keyword: string,
        category: string,
        type: string,
        page: number = 1,
        limit: number = 10
    ) {
        try {
            const offset = (page - 1) * limit;
            const whereClause: any = {};
            if (keyword) {
                whereClause.title = { [Op.iLike]: `%${keyword}%` };
            }
            if (category) {
                whereClause.category = { [Op.iLike]: `%${category}%` };
            }
            if (type) {
                whereClause.type = {
                    [Op.iLike]: `%${type}%`,
                };
            }
            const portfolio = await this.portfolioRepository.findAll({
                where: whereClause,
                include: { all: true },
                offset,
                limit,
            });
            const totalPortfolio = await this.portfolioRepository.count({
                where: whereClause,
            });
            const pageCount = Math.ceil(totalPortfolio / limit);
            return { portfolio, totalPortfolio, page, pageCount, limit };
        } catch (error) {
            console.error("Error in getAllPortfolio:", error);
            throw error;
        }
    }

    async getPortfolioById(id: number) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id },
            include: { all: true },
        });
        if (portfolio) {
            return portfolio;
        } else {
            throw new HttpException(
                "Портфолио не найдено",
                HttpStatus.NOT_FOUND
            );
        }
    }

    async updatePortfolio(
        req: any,
        portfolioId: number,
        updatePortfolioDto: Partial<CreatePortfolioDto>,
        image: any,
        docs: any
    ) {
        try {
            const portfolio = await this.portfolioRepository.findByPk(
                portfolioId
            );
            if (portfolio) {
                const user = req.user;
                if (portfolio.userId == user.id) {
                    updatePortfolioDto.userId = user.id;
                    let fileName = portfolio.image;
                    if (image) {
                        fileName = await this.fileService.createFile(image);
                    }

                    let fileDocsName = portfolio.docs;
                    if (docs) {
                        fileDocsName = await this.fileService.createFile(docs);
                    }
                    await portfolio.update({
                        ...updatePortfolioDto,
                        image: fileName,
                        docs: fileDocsName,
                    });
                    return portfolio;
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.NOT_FOUND
                    );
                }
            } else {
                throw new HttpException(
                    "Портфолио не найдено",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deletePortfolioById(req: any, portfolioId: number) {
        try {
            const portfolio = await this.portfolioRepository.findByPk(
                portfolioId
            );
            if (portfolio) {
                const user = req.user;
                if (portfolio.userId === user.id) {
                    if (portfolio.image) {
                        await this.fileService.deleteFile(portfolio.image);
                    }
                    if (portfolio.docs) {
                        await this.fileService.deleteFile(portfolio.docs);
                    }
                    await portfolio.destroy();
                    return {
                        success: true,
                        message: "Портфолио успешно удалено",
                    };
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором портфолио",
                        HttpStatus.FORBIDDEN
                    );
                }
            } else {
                throw new HttpException(
                    "Портфолио не найдено",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw new HttpException(
                "Ошибка при удалении портфолио",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

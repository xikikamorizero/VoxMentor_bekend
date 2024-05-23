import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Portfolio } from "./portfolio.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";
import { Op } from "sequelize";
import { User } from "src/users/users.model";
import { error } from "console";
import { Type } from "src/type_portfolio/types.model";

@Injectable()
export class PortfolioService {
    constructor(
        @InjectModel(Portfolio) private portfolioRepository: typeof Portfolio,
        @InjectModel(Type) private typeRepository: typeof Type,
        @InjectModel(User) private userRepository: typeof User,
        private fileService: FilesPortfolioService
    ) {}

    async create(req: any, dto: CreatePortfolioDto, image: any, docs: any) {
        try {
            const User = await this.userRepository.findByPk(req.user.id);
            const Type = await this.typeRepository.findByPk(dto.typeId);
            if (User && Type) {
                dto.userId = User.id;
                dto.type = Type;

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
                await Type.increment("count");
                await User.increment("portfolioCount");
                return portfolio;
            } else {
                throw error;
            }
        } catch (error) {
            console.log("что-то пошло не так", error);
            throw error;
        }
    }

    async getAllPortfolio(
        keyword: string,
        category: string,
        typeId: number,
        page: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        sortOrder: "ASC" | "DESC" = "ASC"
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
            if (typeId) {
                whereClause.typeId = typeId;
            }
            const {
                count,
                rows: portfolio,
            } = await this.portfolioRepository.findAndCountAll({
                where: whereClause,
                include: { all: true },
                offset,
                limit,
                order: [[sortBy, sortOrder]]
            });
            const pageCount = Math.ceil(count / limit);
            return { portfolio, count, page, pageCount, limit };
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
            const Type = await this.typeRepository.findByPk(
                updatePortfolioDto.typeId
            );
            if (portfolio && Type) {
                const user = req.user;
                if (portfolio.userId == user.id) {
                    updatePortfolioDto.userId = user.id;
                    updatePortfolioDto.type = Type;
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
                    const portfolioupd = await this.portfolioRepository.findOne(
                        {
                            where: { id: portfolioId },
                            include: { all: true },
                        }
                    );
                    return portfolioupd;
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
            const Type = await this.typeRepository.findByPk(portfolio.typeId);
            if (portfolio) {
                const User = await this.userRepository.findByPk(req.user.id);
                if (portfolio.userId === User.id) {
                    if (portfolio.image) {
                        await this.fileService.deleteFile(portfolio.image);
                    }
                    if (portfolio.docs) {
                        await this.fileService.deleteFile(portfolio.docs);
                    }
                    await portfolio.destroy();
                    await Type.decrement("count");
                    await User.decrement("portfolioCount");

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

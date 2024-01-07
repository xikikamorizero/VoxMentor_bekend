import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Portfolio } from "./portfolio.model";
import { FilesPortfolioService } from "../files_portfolio/files_portfolio.service";

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
            const fileName = await this.fileService.createFile(image);
            const fileDocsName = await this.fileService.createFile(docs);
            const portfolio = await this.portfolioRepository.create({
                ...dto,
                image: fileName,
                docs: fileDocsName,
            });
            return portfolio;
        } catch {
            console.log("что-то пошло не так");
        }
    }

    async getAllPortfolio(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const post = await this.portfolioRepository.findAll({
            include: { all: true },
            offset,
            limit,
        });
        const totalPortfolio = await this.portfolioRepository.count({});
        const pageCount = Math.ceil(totalPortfolio / limit);
        return { post, totalPortfolio, pageCount };
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
                if(portfolio.userId==user.id){
                    updatePortfolioDto.userId = user.id;
                    const fileName = await this.fileService.createFile(image);
                    const fileDocsName = await this.fileService.createFile(docs);
                    await portfolio.update({
                        ...updatePortfolioDto,
                        image: fileName,
                        docs: fileDocsName,
                    });
                    return portfolio;
                }else{
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
        }
    }
}

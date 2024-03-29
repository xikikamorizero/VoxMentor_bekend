import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Get,
    UseGuards,
    Request,
    Query,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { PortfolioService } from "./portfolio.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { GetTaskSearchParams } from "./dto/getTaskSearchParams";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("portfolio")
export class PortfolioController {
    constructor(private portfolioService: PortfolioService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "image", maxCount: 1 },
            { name: "docs", maxCount: 1 },
        ])
    )
    createPost(
        @Request() req,
        @Body() dto: CreatePortfolioDto,
        @UploadedFiles()
        files: { image: Express.Multer.File[]; docs: Express.Multer.File[] }
    ) {
        return this.portfolioService.create(
            req,
            dto,
            files.image ? files.image[0] : null,
            files.docs ? files.docs[0] : null
        );
    }

    @Get()
    getAll(@Query() filerDto: GetTaskSearchParams) {
        return this.portfolioService.getAllPortfolio(
            filerDto.keyword,
            filerDto.category,
            filerDto.type,
            filerDto.page,
            filerDto.limit
        );
    }

    @Get(":id")
    getPortfolioById(@Param("id") portfolioId: number) {
        return this.portfolioService.getPortfolioById(portfolioId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "image", maxCount: 1 },
            { name: "docs", maxCount: 1 },
        ])
    )
    updatePortfolio(
        @Request() req,
        @Param("id") portfolioId: number,
        @Body() updatePortfolioDto: Partial<CreatePortfolioDto>,
        @UploadedFiles()
        files: { image: Express.Multer.File[]; docs: Express.Multer.File[] }
    ) {
        return this.portfolioService.updatePortfolio(
            req,
            portfolioId,
            updatePortfolioDto,
            files.image ? files.image[0] : null,
            files.docs ? files.docs[0] : null
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deletePortfolio(@Request() req, @Param("id") portfolioId: number) {
        return this.portfolioService.deletePortfolioById(req, portfolioId);
    }
}

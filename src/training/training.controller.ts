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
import { CreateTraningDto } from "./dto/create-award.dto";
import { EditTraningDto } from "./dto/update-award.dto";
import {TraningService } from "./training.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("traning")
export class TraningController {
    constructor(private awardService: TraningService) {}

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
        @Body() dto: CreateTraningDto,
        @UploadedFiles()
        files: { image: Express.Multer.File[]; docs: Express.Multer.File[] }
    ) {
        return this.awardService.create(
            req,
            dto,
            files.image ? files.image[0] : null,
            files.docs ? files.docs[0] : null
        );
    }

    @Get(":id")
    getAwardById(@Param("id") awardId: number) {
        return this.awardService.getAwardById(awardId);
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
        @Param("id") awardId: number,
        @Body() updatePortfolioDto: Partial<EditTraningDto>,
        @UploadedFiles()
        files: { image: Express.Multer.File[]; docs: Express.Multer.File[] }
    ) {
        return this.awardService.updateAward(
            req,
            awardId,
            updatePortfolioDto,
            files.image ? files.image[0] : null,
            files.docs ? files.docs[0] : null
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deletePortfolio(@Request() req, @Param("id") awardId: number) {
        return this.awardService.deleteById(req, awardId);
    }
}

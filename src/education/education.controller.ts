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
import { CreateEducationDto } from "./dto/create-education.dto";
import { EditEducationDto } from "./dto/update-education.dto";
import {EducationService } from "./education.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("education")
export class EducationController {
    constructor(private awardService: EducationService) {}

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
        @Body() dto: CreateEducationDto,
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
        @Body() updatePortfolioDto: Partial<EditEducationDto>,
        @UploadedFiles()
        files: { image: Express.Multer.File[]; docs: Express.Multer.File[] }
    ) {
        return this.awardService.update(
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

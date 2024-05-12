import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Get,
    UseGuards,
    Request,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { CreateAwardDto } from "./dto/create-award.dto";
import {EditAwardDto} from './dto/update-award.dto';
import {AwardService } from "./award.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("award")
export class AwardController {
    constructor(private awardService: AwardService) {}

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
        @Body() dto: CreateAwardDto,
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
        @Body() updatePortfolioDto: Partial<EditAwardDto>,
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
        return this.awardService.deleteAwardById(req, awardId);
    }
}

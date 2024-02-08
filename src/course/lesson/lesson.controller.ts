import {
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Body,
    UseGuards,
    Request,
    Put,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { LessonsService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("lessons")
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    getLessonById(@Request() req, @Param("id") lessonId: number) {
        return this.lessonsService.getLessonById(req, lessonId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor("image"))
    createLesson(
        @Request() req,
        @Body() lessondto: CreateLessonDto,
        @UploadedFile() image
    ) {
        return this.lessonsService.createLesson(
            req,
            lessondto,
            image ? image : null
        );
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image"))
    updateCourse(
        @Request() req,
        @Param("id") lessonId: number,
        @Body() updateDto: Partial<CreateLessonDto>,
        @UploadedFile() image
    ) {
        return this.lessonsService.updateLessons(
            req,
            lessonId,
            updateDto,
            image ? image : null
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteLesson(@Request() req, @Param("id") lessonId: number) {
        return this.lessonsService.deleteLesson(req, lessonId);
    }
}

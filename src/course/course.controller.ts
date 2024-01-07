import {
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Body,
    UploadedFile,
    UseInterceptors,
    Query,
    UseGuards,
    Request,
    Put
} from "@nestjs/common";
import { CoursesService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetTaskSearchParams } from "./dto/getTaskSearchParams";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("courses")
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    getAllCourses(
        @Request() req,
        @Param("id") authorId: number,
        @Query() filerDto: GetTaskSearchParams
    ) {
        if (filerDto.category) {
            return this.coursesService.getCoursesByAuthorByCategory(
                req,
                authorId,
                filerDto.page,
                filerDto.limit,
                filerDto.category
            );
        } else if (filerDto.keyword) {
            return this.coursesService.getCoursesByAuthorByKeyword(
                req,
                authorId,
                filerDto.page,
                filerDto.limit,
                filerDto.keyword
            );
        } else {
            return this.coursesService.getAllCoursesByAuthorId(
                req,
                authorId,
                filerDto.page,
                filerDto.limit
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/lessons")
    getLessonsByCourseId(@Request() req, @Param("id") courseId: number) {
        return this.coursesService.getLessonsByCourseId(req, courseId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image"))
    createCourse(
        @Request() req,
        @Body() coursedto: CreateCourseDto,
        @UploadedFile() image
    ) {
        return this.coursesService.createCourse(coursedto, image, req);
    }

  
    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image"))
    updateCourse(
        @Request() req,
        @Param("id") courseId: number,
        @Body() updateDto: Partial<CreateCourseDto>,
        @UploadedFile() image
    ) {
        return this.coursesService.updateCourse(
            req,
            courseId,
            updateDto,
            image
        );
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    deleteCourse(@Request() req, @Param("id") courseId: number) {
        return this.coursesService.deleteCourse(req, courseId);
    }
}

import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Lesson } from "./lesson.model";
import { Course } from "../course.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { EditLessonDto } from "./dto/edit-lesson.dto";
import { FilesService } from "../../files/files.service";
import UsersService from "../../users/users.service";

@Injectable()
export class LessonsService {
    constructor(
        @InjectModel(Lesson) private lessonRepository: typeof Lesson,
        @InjectModel(Course) private courseRepository: typeof Course,
        private usersService: UsersService,
        private fileService: FilesService
    ) {}

    async getLessonById(req: any, lessonId: number) {
        const lesson = await this.lessonRepository.findByPk(lessonId);
        if (lesson) {
            const course = await this.courseRepository.findByPk(
                lesson.courseId
            );
            const user = req.user;
            const isSubscribed = await this.usersService.checkSubscription(
                user.id,
                course.authorId
            );
            if (user.id == course.authorId || isSubscribed) {
                return lesson;
            } else {
                throw new NotFoundException(
                    "you are not the author of the lesson or a subscriber of the lesson"
                );
            }
        } else {
            throw new NotFoundException("no lesson with this ID");
        }
    }

    async createLesson(req: any, dto: CreateLessonDto, image: any) {
        try {
            const course = await this.courseRepository.findByPk(dto.courseId);
            if (course) {
                const user = req.user;
                if (user.id == dto.courseId) {
                    let fileName = null;
                    if (image) {
                        fileName = await this.fileService.createFile(image);
                    }
                    const lesson = await this.lessonRepository.create({
                        ...dto,
                        image: fileName,
                    });
                    const courseId = dto.courseId;
                    await this.updateCourseLessonCount(courseId);
                    return lesson;
                } else {
                    throw new NotFoundException(
                        "you are not the author of the course"
                    );
                }
            } else {
                throw new NotFoundException("Course not found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateLessons(
        req: any,
        lessonId: number,
        updateDto: Partial<EditLessonDto>,
        image: any
    ) {
        try {
            const lesson = await this.lessonRepository.findByPk(lessonId);
            const course = await this.courseRepository.findByPk(
                lesson.courseId
            );
           
            if (course && lesson && course.id == lesson.courseId) {
                const user = req.user;
                if (course.authorId == user.id) {
                    let fileName = lesson.image;
                    if (image) {
                        fileName = await this.fileService.createFile(image);
                    }
                    await lesson.update({
                        ...updateDto,
                        image: fileName,
                    });
                    return lesson;
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.NOT_FOUND
                    );
                }
            } else {
                throw new HttpException("не найден", HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteLesson(req: any, lessonId: number) {
        try {
            const lesson = await this.lessonRepository.findByPk(lessonId);
            if (lesson) {
                const user = req.user;
                const courseId = lesson.courseId;
                const course = await this.courseRepository.findByPk(courseId);
                if (course) {
                    if (user.id == course.authorId) {
                        await lesson.destroy();
                        await this.updateCourseLessonCount(courseId);
                        return {
                            success: true,
                            message: "Lesson successfully deleted",
                        };
                    } else {
                        throw new NotFoundException(
                            "you are not the author of the lesson"
                        );
                    }
                } else {
                    throw new NotFoundException(
                        "the lesson is not tied to the course"
                    );
                }
            } else {
                throw new NotFoundException("Lesson not found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async updateCourseLessonCount(courseId: number) {
        const lessonCount = await this.lessonRepository.count({
            where: { courseId },
        });
        const course = await this.courseRepository.findByPk(courseId);

        if (course) {
            course.lessonCount = lessonCount;
            await course.save();
        }
    }
}

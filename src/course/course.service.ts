import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Course } from "./course.model";
import { CreateCourseDto } from "./dto/create-course.dto";
import { InjectModel } from "@nestjs/sequelize";
import { FilesService } from "../files/files.service";
import { Sequelize } from "sequelize";
import UsersService from "../users/users.service";
import { User } from "src/users/users.model";
import { error } from "console";

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course) private courseRepository: typeof Course,
        @InjectModel(User) private userRepository: typeof User,
        private fileService: FilesService,
        private usersService: UsersService
    ) {}

    async getAllCoursesByAuthorId(
        req: any,
        authorId: number,
        page: number = 1,
        limit: number = 10
    ) {
        const user = req.user;
        const isSubscribed = await this.usersService.checkSubscription(
            user.id,
            authorId
        );
        if (isSubscribed || user.id == authorId) {
            const offset = (page - 1) * limit;
            const courses = await this.courseRepository.findAll({
                where: {
                    authorId: authorId,
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.courseRepository.count({
                where: {
                    authorId: authorId,
                },
            });
            const pageCount = Math.ceil(totalCourses / limit);
            return { courses, totalCourses, page, pageCount, limit };
        } else {
            throw new NotFoundException(
                "У вас нет доступа для получения этой информации."
            );
        }
    }

    async getCoursesByAuthorByKeyword(
        req: any,
        authorId,
        page = 1,
        limit = 10,
        keyword
    ) {
        const user = req.user;
        const isSubscribed = await this.usersService.checkSubscription(
            user.id,
            authorId
        );
        if (isSubscribed || user.id == authorId) {
            const offset = (page - 1) * limit;
            const { Op } = require("sequelize");

            const courses = await this.courseRepository.findAll({
                where: {
                    [Op.and]: [
                        Sequelize.literal(
                            `LOWER("title") LIKE LOWER('%${keyword}%')`
                        ),
                        {
                            authorId: authorId,
                        },
                    ],
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.courseRepository.count({
                where: {
                    [Op.and]: [
                        Sequelize.literal(
                            `LOWER("title") LIKE LOWER('%${keyword}%')`
                        ),
                        {
                            authorId: authorId,
                        },
                    ],
                },
            });

            const pageCount = Math.ceil(totalCourses / limit);

            return { courses, totalCourses, page, pageCount, limit };
        } else {
            throw new NotFoundException(
                "this course can only be viewed by subscribers of its creator"
            );
        }
    }

    async getCoursesByAuthorByCategory(
        req: any,
        authorId: number,
        page: number = 1,
        limit: number = 10,
        category: any
    ) {
        const user = req.user;
        const isSubscribed = await this.usersService.checkSubscription(
            user.id,
            authorId
        );
        if (isSubscribed || user.id == authorId) {
            const offset = (page - 1) * limit;
            const { Op } = require("sequelize");
            const courses = await this.courseRepository.findAll({
                where: {
                    [Op.and]: [
                        Sequelize.literal(
                            `LOWER("category") = LOWER('${category}')`
                        ),
                        {
                            authorId: authorId,
                        },
                    ],
                },
                offset,
                limit,
                include: { all: true },
            });

            const totalCourses = await this.courseRepository.count({
                where: {
                    [Op.and]: [
                        Sequelize.literal(
                            `LOWER("category") = LOWER('${category}')`
                        ),
                        {
                            authorId: authorId,
                        },
                    ],
                },
            });
            const pageCount = Math.ceil(totalCourses / limit);
            return { courses, totalCourses, page, pageCount, limit };
        } else {
            throw new NotFoundException(
                "this course can only be viewed by subscribers of its creator"
            );
        }
    }

    async getLessonsByCourseId(req: any, courseId: number) {
        const course = await this.courseRepository.findByPk(courseId, {
            include: { all: true },
        });
        if (course) {
            const user = req.user;
            const isSubscribed = await this.usersService.checkSubscription(
                user.id,
                course.authorId
            );
            if (isSubscribed || user.id == course.authorId) {
                return course?.lessons || [];
            } else {
                throw new NotFoundException(
                    "this course can only be viewed by subscribers of its creator"
                );
            }
        } else {
            throw new NotFoundException("course not found");
        }
    }

    async getCoursesByCategory(category: any) {
        const courses = await this.courseRepository.findAll({
            where: Sequelize.literal(
                `LOWER("category") = LOWER('${category}')`
            ),
            include: { all: true },
        });
        return courses;
    }

    async getCoursesById(req: any, courseId: number) {
        const course = await this.courseRepository.findByPk(courseId, {
            include: { all: true },
        });
        if (course) {
            const user = req.user;
            const isSubscribed = await this.usersService.checkSubscription(
                user.id,
                course.authorId
            );
            if (isSubscribed || user.id == course.authorId) {
                return course;
            } else {
                throw new NotFoundException("нет доступа");
            }
        } else {
            throw new NotFoundException("course not found");
        }
    }

    async createCourse(dto: CreateCourseDto, image: any, req: any) {
        try {
            const User = await this.userRepository.findByPk(req.user.id);
            if(User){
                dto.authorId = User.id;
                let fileName = null;
                if (image) {
                    fileName = await this.fileService.createFile(image);
                }
                const course = await this.courseRepository.create({
                    ...dto,
                    image: fileName,
                });
                await User.increment("courseCount");
                return course;
            }
            else{
                throw new NotFoundException("user not found");
            }
            
        } catch{
            throw error;
        }
    }

    async updateCourse(
        req: any,
        courseId: number,
        updateDto: Partial<CreateCourseDto>,
        image: any
    ) {
        try {
            const course = await this.courseRepository.findByPk(courseId, {
                include: { all: true },
            });
            if (course) {
                const user = req.user;
                if (course.authorId == user.id) {
                    updateDto.authorId = user.id;
                    let fileName = course.image;
                    if (image) {
                        fileName = await this.fileService.createFile(image);
                    }

                    await course.update({
                        ...updateDto,
                        image: fileName,
                    });
                    return course;
                } else {
                    throw new HttpException(
                        "Вы не являетесь автором",
                        HttpStatus.NOT_FOUND
                    );
                }
            } else {
                throw new HttpException("Курс не найден", HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCourse(req: any, courseId: number) {
        try {
            const course = await this.courseRepository.findByPk(courseId);
            if (course) {
                const User = await this.userRepository.findByPk(req.user.id);
                if (User.id == course.authorId) {
                    await course.destroy();
                    await User.decrement("courseCount");
                    return {
                        success: true,
                        message: "Course successfully deleted",
                    };
                } else {
                    throw new NotFoundException(
                        "you are not the course creator"
                    );
                }
            } else {
                throw new NotFoundException("there is no such course");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

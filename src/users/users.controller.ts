import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    UseGuards,
    Query,
    Param,
    UploadedFile,
    UseInterceptors,
    Request,
    Put,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import UsersService from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { GetTaskSearchParams } from "./dto/getTaskSearchParams";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @ApiOperation({ summary: "Создание пользователя" })
    @ApiResponse({ status: 200, type: User })
    // @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: "Получить всех пользователей" })
    @ApiResponse({ status: 200, type: [User] })
    // @UseGuards(JwtAuthGuard)
    // @Roles("User")
    @UseGuards(RolesGuard)
    @Get()
    getAll(@Query() filerDto: GetTaskSearchParams) {
        return this.usersService.getAllUsers(
            filerDto.keyword,
            filerDto.page,
            filerDto.limit
        );
    }

    @ApiOperation({ summary: "Получить всех пользователей" })
    @ApiResponse({ status: 200, type: [User] })
    // @Roles("User")
    @UseGuards(RolesGuard)
    @Get("professor")
    getAllProfessor(@Query() filerDto: GetTaskSearchParams) {
        return this.usersService.getAllUsersByRoleProfessor(
            filerDto.keyword,
            filerDto.page,
            filerDto.limit
        );
    }

    @ApiOperation({ summary: "Получить пользователя по id" })
    @Get(":id")
    getUserById(@Param("id") userId: number) {
        return this.usersService.getUserById(userId);
    }

    @ApiOperation({ summary: "Получить профиль" })
    @Get("profile/me")
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return this.usersService.getProfile(req);
    }

    @ApiOperation({ summary: "Получить Портфолио" })
    @Get("project/me")
    @UseGuards(JwtAuthGuard)
    getProject(@Request() req) {
        return this.usersService.getMyProject(req);
    }

    @ApiOperation({ summary: "Получить всех пользователей" })
    @ApiResponse({ status: 200, type: [User] })
    // @Roles("User")
    @UseGuards(RolesGuard)
    @Get("course:id")
    getCourse(@Param("id") authorId: number) {
        return this.usersService.getAllCourseByAuthorId(authorId);
    }

    @Put()
    @UseInterceptors(FileInterceptor("avatar"))
    @UseGuards(JwtAuthGuard)
    updateProfile(
        @Request() req,
        @Body() updateDto: Partial<UpdateUserDto>,
        @UploadedFile() avatar
    ) {
        return this.usersService.updateUser(req, updateDto, avatar);
    }

    @ApiOperation({ summary: "Удалить пользователя по ID" })
    @ApiResponse({ status: 200, type: User })
    // @Roles("Admin")
    @UseGuards(RolesGuard)
    @Delete(":id")
    deleteUser(@Param("id") userId: number) {
        return this.usersService.deleteUserById(userId);
    }

    @ApiOperation({ summary: "Выдать роль" })
    @ApiResponse({ status: 200 })
    // @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post("/role")
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @ApiOperation({ summary: "Забанить пользователя" })
    @ApiResponse({ status: 200 })
    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post("/ban")
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
    }
    // тесты
    @UseGuards(JwtAuthGuard)
    @Post("test/:id")
    test(@Request() req, @Param("id") id: number) {
        console.log("ПРошло", id);
    }
    //Это поля для запроса связаны с пользователями

    @UseGuards(JwtAuthGuard)
    @Post("subscribe/:id")
    subscribe(@Request() req, @Param("id") authorId: number) {
        const subscriberId = req.user.id;
        return this.usersService.subscribe(subscriberId, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("unsubscribe/:id")
    unsubscribe(@Request() req, @Param("id") authorId: number) {
        const subscriberId = req.user.id;
        return this.usersService.unsubscribe(subscriberId, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("subscriptions")
    getSubscriptions(@Request() req) {
        const userId = req.user.id;
        return this.usersService.getSubscriptions(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("subscribers")
    getSubscribers(@Request() req) {
        const userId = req.user.id;
        return this.usersService.getSubscribers(userId);
    }

    // Это запросы для функционала лайков
    @UseGuards(JwtAuthGuard)
    @Post("like/:id")
    likeUser(@Request() req, @Param("id") likedUserId: number) {
        const userId = req.user.id;
        return this.usersService.like(userId, likedUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("unlike/:id")
    unlikeUser(@Request() req, @Param("id") likedUserId: number) {
        const userId = req.user.id;
        return this.usersService.unlike(userId, likedUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("liked")
    getUsersLikedBy(@Request() req) {
        const userId = req.user.id;
        return this.usersService.getUsersLikedBy(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("dislike/:id")
    dislikeUser(@Request() req, @Param("id") dislikedUserId: number) {
        const userId = req.user.id;
        return this.usersService.dislike(userId, dislikedUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("undislike/:id")
    undislikeUser(@Request() req, @Param("id") dislikedUserId: number) {
        const userId = req.user.id;
        return this.usersService.undislike(userId, dislikedUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("disliked")
    getUsersDislikedBy(@Request() req) {
        const userId = req.user.id;
        return this.usersService.getUsersDislikedBy(userId);
    }
}

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from "./auth/auth.module";
import { Portfolio } from "./portfolio/portfolio.model";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { CourseModule } from "./course/course.module";
import { LessonModule } from "./course/lesson/lesson.module";
import { Course } from "./course/course.model";
import { Lesson } from "./course/lesson/lesson.model";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { Subscription } from "./users/user_follow.model";
import { Like } from "./like_dis/like.model";
import { Dislike } from "./like_dis/dislike.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, "static"),
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRESS_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [
                User,
                Role,
                UserRoles,
                Subscription,
                Like,
                Dislike,
                Course,
                Lesson,
                Portfolio,
            ],
            autoLoadModels: true,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        FilesModule,
        CourseModule,
        LessonModule,
        PortfolioModule,
    ],
})
export class AppModule {}

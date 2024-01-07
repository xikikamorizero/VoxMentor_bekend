import { Module, forwardRef} from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Course} from "./course.model";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";
import { Lesson } from './lesson/lesson.model';
import { User } from '../users/users.model';
import { Subscription } from '../users/user_follow.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [CoursesService],
  controllers: [CoursesController],
  imports: [
    SequelizeModule.forFeature([User, Course, Lesson, Subscription]),
      FilesModule,
      UsersModule,
      forwardRef(() => AuthModule),
  ]
})
export class CourseModule {}

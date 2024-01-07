import { Module, forwardRef} from '@nestjs/common';
import { LessonsService } from './lesson.service';
import { LessonsController } from './lesson.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Lesson} from "./lesson.model";
import {FilesModule} from "../../files/files.module";
import {AuthModule} from "../../auth/auth.module";
import { Course } from '../course.model';
import { UsersModule } from '../../users/users.module';

@Module({
  providers: [LessonsService],
  controllers: [LessonsController],
  imports: [
    SequelizeModule.forFeature([Lesson, Course]),
      FilesModule,
      UsersModule,
      forwardRef(() => AuthModule),
  ]
})
export class LessonModule {}

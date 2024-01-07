import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import UsersService from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Course} from "../course/course.model";
import { Portfolio } from '../portfolio/portfolio.model';
import{Subscription} from './user_follow.model';
import { Like } from '../like_dis/like.model';
import { Dislike } from '../like_dis/dislike.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Role, UserRoles, Subscription, Course, Portfolio, Like, Dislike]),
      RolesModule,
      forwardRef(() => AuthModule),
  ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}

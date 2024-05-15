import {Module} from '@nestjs/common';
import {TypesService} from './types.service';
import {TypesController} from './types.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Type} from "./types.model";
import {User} from "../users/users.model";
import {PortfolioTypes} from "./portfolio-types.model";

@Module({
  providers: [TypesService],
  controllers: [TypesController],
  imports: [
    SequelizeModule.forFeature([Type, User, PortfolioTypes])
  ],
  exports: [
    TypesService
  ]
})
export class TypesModule {}

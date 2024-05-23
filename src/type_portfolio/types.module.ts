import { Module, forwardRef } from "@nestjs/common";
import { TypesService } from "./types.service";
import { TypesController } from "./types.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Type } from "./types.model";
import { User } from "../users/users.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
    providers: [TypesService],
    controllers: [TypesController],
    imports: [
        SequelizeModule.forFeature([Type, User]),
        forwardRef(() => AuthModule),
    ],
    exports: [TypesService],
})
export class TypesModule {}

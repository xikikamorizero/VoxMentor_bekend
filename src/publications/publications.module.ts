import { Module, forwardRef } from "@nestjs/common";
import { PublicationsService } from "./publications.service";
import { PublicationsController } from "./publications.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Publications } from "./publications.model";
import { FilesPortfolioModule } from "../files_portfolio/files_portfolio.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [PublicationsService],
    controllers: [PublicationsController],
    imports: [
        SequelizeModule.forFeature([
            User,
            Publications,
        ]),
        FilesPortfolioModule,
        forwardRef(() => AuthModule),
    ],
})
export class PublicationsModule {}

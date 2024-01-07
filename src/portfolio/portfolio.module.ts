import { Module, forwardRef } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { PortfolioController } from "./portfolio.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Portfolio } from "./portfolio.model";
import { FilesPortfolioModule } from "../files_portfolio/files_portfolio.module";
import { AuthModule } from "../auth/auth.module";
import { PortfolioLike } from "../like_dis_porfolio/like.model";
import { PortfolioDislike } from "../like_dis_porfolio/dislike.model";

@Module({
    providers: [PortfolioService],
    controllers: [PortfolioController],
    imports: [
        SequelizeModule.forFeature([
            User,
            Portfolio,
            PortfolioLike,
            PortfolioDislike,
        ]),
        FilesPortfolioModule,
        forwardRef(() => AuthModule),
    ],
})
export class PortfolioModule {}

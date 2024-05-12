import { Module, forwardRef } from "@nestjs/common";
import { AwardService } from "./award.service";
import { AwardController } from "./award.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Award } from "./award.model";
import { FilesPortfolioModule } from "../files_portfolio/files_portfolio.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [AwardService],
    controllers: [AwardController],
    imports: [
        SequelizeModule.forFeature([
            User,
            Award,
        ]),
        FilesPortfolioModule,
        forwardRef(() => AuthModule),
    ],
})
export class AwardModule {}

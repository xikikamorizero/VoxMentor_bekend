import { Module, forwardRef } from "@nestjs/common";
import { EducationService } from "./education.service";
import { EducationController } from "./education.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Education } from "./education.model";
import { FilesPortfolioModule } from "../files_portfolio/files_portfolio.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [EducationService],
    controllers: [EducationController],
    imports: [
        SequelizeModule.forFeature([
            User,
            Education,
        ]),
        FilesPortfolioModule,
        forwardRef(() => AuthModule),
    ],
})
export class EducationModule {}

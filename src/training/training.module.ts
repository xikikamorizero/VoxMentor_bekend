import { Module, forwardRef } from "@nestjs/common";
import { TraningService } from "./training.service";
import { TraningController } from "./training.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Traning } from "./training.model";
import { FilesPortfolioModule } from "../files_portfolio/files_portfolio.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [TraningService],
    controllers: [TraningController],
    imports: [
        SequelizeModule.forFeature([
            User,
            Traning,
        ]),
        FilesPortfolioModule,
        forwardRef(() => AuthModule),
    ],
})
export class TraningModule {}

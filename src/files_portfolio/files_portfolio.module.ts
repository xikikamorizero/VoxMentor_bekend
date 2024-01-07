import { Module } from '@nestjs/common';
import { FilesPortfolioService } from './files_portfolio.service';

@Module({
  providers: [FilesPortfolioService],
  exports: [FilesPortfolioService]
})
export class FilesPortfolioModule {}

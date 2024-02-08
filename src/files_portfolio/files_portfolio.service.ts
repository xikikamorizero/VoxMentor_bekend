import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

@Injectable()
export class FilesPortfolioService {
    async createFile(file): Promise<string> {
        try {
            const fileExt = path.extname(file.originalname);
            const fileName = uuid.v4() + fileExt;
            const filePath = path.resolve(__dirname, "..", "static");

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer);

            return fileName;
        } catch (e) {
            throw new HttpException(
                "Произошла ошибка при записи файла",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    async deleteFile(fileName: string): Promise<void> {
        try {
            const filePath = path.resolve(__dirname, "..", "static", fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(error);
            throw new HttpException(
                "Ошибка при удалении файла",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

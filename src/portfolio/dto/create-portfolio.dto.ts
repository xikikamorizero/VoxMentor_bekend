import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreatePortfolioDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title: string;

    @ApiProperty({example: 'test text', description: 'Текст'})
    @IsString({message: "Должно быть строкой"})
    readonly content: string;

    @ApiProperty({example: 'Математика', description: 'Категория'})
    @IsString({message: "Должно быть строкой"})
    readonly category: string;

    // @ApiProperty({example: 'Докторская', description: 'Type'})
    // @IsString({message: "Должно быть строкой"})
    readonly typeId: number;

    readonly year: number;

    type: any;

    @ApiProperty({example: 12, description: 'id Пользователя'})
    userId: string;
}

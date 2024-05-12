import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class EditEducationDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title?: string;

    @IsString({message: "Должно быть строкой"})
    readonly date?: string;
}

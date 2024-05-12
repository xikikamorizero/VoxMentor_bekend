import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class EditPublicationsDto {
    @ApiProperty({example: 'Test', description: 'Заголовок'})
    @IsString({message: "Должно быть строкой"})
    readonly title?: string;

    readonly year?: number;

    @ApiProperty({example: 'Докторская', description: 'Type'})
    @IsString({message: "Должно быть строкой"})
    readonly type?: string;

    @ApiProperty({example: 'Докторская', description: 'Type'})
    @IsString({message: "Должно быть строкой"})
    readonly link?: string;
}

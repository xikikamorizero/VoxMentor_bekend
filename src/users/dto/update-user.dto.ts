import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: "Вася Пупкин Магистр", description: "ФИО" })
    @IsString({ message: "Должно быть строкой" })
    readonly name?: string | null;

    avatar?: string | null;

    @ApiProperty({ example: "Я устал я ухожу", description: "о себе" })
    @IsString({ message: "Должно быть строкой" })
    readonly description?: string | null;
    
    @ApiProperty({ example: "НУУЗ", description: "Место работы пользователя" })
    @IsString({ message: "Должно быть строкой" })
    readonly place_of_work?: string | null;

    @ApiProperty({ example: "Профессор", description: "Научная степень" })
    @IsString({ message: "Должно быть строкой" })
    readonly science_degree?: string | null;
    
    @ApiProperty({ example: "Математика, Информатика, Физика", description: "Предметы" })
    @IsString({ message: "Должно быть строкой" })
    readonly categories?: string[] | null;
    
    @ApiProperty({ example: "+************", description: "Способ связи" })
    @IsString({ message: "Должно быть строкой" })
    readonly contacts?: string | null;
}

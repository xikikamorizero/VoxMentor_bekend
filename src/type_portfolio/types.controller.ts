import {Body, Controller, Get, Post, Param, Put,Delete} from '@nestjs/common';
import {TypesService} from "./types.service";
import {CreateDto} from "./dto/create-type.dto";

@Controller('types')
export class TypesController {
    constructor(private typeService: TypesService) {}

    @Post()
    create(@Body() dto: CreateDto) {
        return this.typeService.create(dto);
    }

    @Get('value')
    getByValue() {
        return this.typeService.getByValue("User");
    }

    @Get()
    getAllRole(){
        return this.typeService.getAll();
    }

    @Put(":id")
    update(@Param("id") id: number,@Body() updateDto: Partial<CreateDto>){
        return this.typeService.edit(id, updateDto)
    }
    @Delete(":id")
    delete(@Param("id") id: number,){
        return this.typeService.delete(id)
    }
}

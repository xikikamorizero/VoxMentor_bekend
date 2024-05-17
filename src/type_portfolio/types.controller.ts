import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Put,
    Delete,
    UseGuards,
    Request
} from "@nestjs/common";
import { TypesService } from "./types.service";
import { CreateDto } from "./dto/create-type.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("types")
export class TypesController {
    constructor(private typeService: TypesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() dto: CreateDto) {
        return this.typeService.create(req, dto);
    }

    @Get("value")
    getByValue() {
        return this.typeService.getByValue("User");
    }

    @Get()
    getAllRole() {
        return this.typeService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    update(@Param("id") id: number, @Body() updateDto: Partial<CreateDto>) {
        return this.typeService.edit(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.typeService.delete(id);
    }
}

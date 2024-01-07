import {Body, Controller, Get, Post, Param} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get('value')
    getByValue() {
        return this.roleService.getRoleByValue("User");
    }

    @Get()
    getAllRole(){
        return this.roleService.getAllRole();
    }
}

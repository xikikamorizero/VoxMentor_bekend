import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        console.log("Я сделяль");
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } });
        return role;
    }

    async getAllRole() {
        const role: any = await this.roleRepository.findAll({
            include: {
                all: true,
                attributes: {
                    exclude: ["password"],
                },
            },
        });
        return role;
    }
}

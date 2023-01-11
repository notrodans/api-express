import { UserModel } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";
import { UserEntity } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}

	async create({ email, password, name }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password
			}
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email
			}
		});
	}
}

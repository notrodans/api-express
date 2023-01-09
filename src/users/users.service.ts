import { UserModel } from "@prisma/client"
import { UserRegisterDto } from "./dto/user-register.dto"
import { inject, injectable } from "inversify"
import { IConfigService } from "../config/config.service.interface"
import { TYPES } from "../types"
import { UserLoginDto } from "./dto/user-login.dto"
import { UserEntity } from "./user.entity"
import { IUsersRepository } from "./users.repository.interface"
import { IUserService } from "./users.service.interface"

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.UsersRepository) private readonly usersRepository: IUsersRepository
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name)
		const salt = this.configService.get("SALT")
		await newUser.setPassword(password, Number(salt))
		const existedUser = await this.usersRepository.find(email)
		if (existedUser) {
			return null
		}
		return this.usersRepository.create(newUser)
	}

	async validateUser({ email, password }: UserLoginDto) {
		const existedUser = await this.usersRepository.find(email)
		if (!existedUser) {
			return false
		}
		const newUser = new UserEntity(existedUser?.email, existedUser?.name, existedUser?.password)
		return await newUser.comparePassword(password)
	}
}

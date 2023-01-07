import { UserLoginDto } from "./dto/user-login.dto"
import { UserRegisterDto } from "./dto/user-register.dto"
import { UserEntity } from "./user.entity"

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserEntity | null>
	validateUser: (dto: UserLoginDto) => Promise<boolean>
}

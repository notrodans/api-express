import { NextFunction, Request, Response } from "express"
import { BaseController } from "../common/base.controller"
import { HTTPError } from "../errors/http-error.class"
import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { ILogger } from "../logger/logger.interface"
import { IUserController } from "./users.interface"
import { UserLoginDto } from "./dto/user-login.dto"
import { UserRegisterDto } from "./dto/user-register.dto"
import { ValidateMiddleware } from "../common/validate.middleware"
import { UserService } from "./users.service"

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private readonly loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: UserService
	) {
		super(loggerService)
		this.bindRoutes([
			{
				path: "/login",
				func: this.login,
				method: "post",
				middlewares: [new ValidateMiddleware(UserLoginDto)]
			},
			{
				path: "/register",
				func: this.register,
				method: "post",
				middlewares: [new ValidateMiddleware(UserRegisterDto)]
			}
		])
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.validateUser(body)
		if (!result) {
			return next(new HTTPError(401, "Ошибка авторизации", "login"))
		}
		this.ok(res, "Успешная авторизация")
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) {
		const result = await this.userService.createUser(body)
		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует"))
		}
		this.ok(res, { email: result.email, id: result.id })
	}
}

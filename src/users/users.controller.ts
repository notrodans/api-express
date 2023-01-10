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
import { sign } from "jsonwebtoken"
import { IConfigService } from "../config/config.service.interface"
import { IUserService } from "./users.service.interface"
import { AuthGuard } from "../common/auth.guard"

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private readonly loggerService: ILogger,
		@inject(TYPES.UserService) private readonly userService: IUserService,
		@inject(TYPES.ConfigService) private readonly configService: IConfigService
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
			},
			{
				path: "/info",
				func: this.info,
				method: "get",
				middlewares: [new AuthGuard()]
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
		const jwt = await this.signJWT(body.email, this.configService.get("SECRET"))
		this.ok(res, { jwt })
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) {
		const result = await this.userService.createUser(body)
		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует"))
		}
		this.ok(res, { email: result.email, id: result.id })
	}

	async info({ user }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) {
		const findedUser = await this.userService.findUser(user)
		if (!findedUser) {
			return next(new HTTPError(401, "Такого пользователя не найдено"))
		}
		this.ok(res, { email: findedUser?.email, id: findedUser?.id })
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000)
				},
				secret,
				{ algorithm: "HS256" },
				(err, token) => {
					if (err) {
						reject(err)
					}
					resolve(token as string)
				}
			)
		})
	}
}

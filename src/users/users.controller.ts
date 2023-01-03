import { NextFunction, Request, Response } from "express"
import { BaseController } from "../common/base.controller"
import { HTTPError } from "../errors/http-error.class"
import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { ILogger } from "../logger/logger.interface"

@injectable()
export class UserController extends BaseController {
	constructor(@inject(TYPES.ILogger) private readonly loggerService: ILogger) {
		super(loggerService)
		this.bindRoutes([
			{ path: "/login", func: this.login, method: "post" },
			{ path: "/register", func: this.register, method: "post" }
		])
	}

	login(req: Request, res: Response, next: NextFunction) {
		next(new HTTPError(401, "Ошибка авторизации", "login"))
	}

	register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, "register")
	}
}

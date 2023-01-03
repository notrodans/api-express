import express, { Express } from "express"
import { Server } from "http"
import { UserController } from "./users/users.controller"
import { ExceptionFilter } from "./errors/exception.filter"
import { ILogger } from "./logger/logger.interface"
import { inject, injectable } from "inversify"
import { TYPES } from "./types"
import "reflect-metadata"

@injectable()
export class App {
	app: Express
	port: number
	server: Server

	constructor(
		@inject(TYPES.ILogger) private readonly logger: ILogger,
		@inject(TYPES.UserControoler) private readonly usersController: UserController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
	) {
		this.app = express()
		this.port = 8000
	}

	useRoutes() {
		this.app.use("/users", this.usersController.router)
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	public async init() {
		this.useRoutes()
		this.useExceptionFilters()
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Сервер запущен на https://localhost:${this.port}`)
		})
	}
}

import express, { Express } from "express";
import { ILogger } from "./logger/logger.interface";
import { Server } from "http";
import { json } from "body-parser";
import { IExceptionFilter } from "./errors/exception-filter.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { IConfigService } from "./config/config.service.interface";
import { UserController } from "./users/users.controller";
import { PrismaService } from "./database/prisma.service";
import "reflect-metadata";
import { AuthMiddleware } from "./common/auth.middleware";

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private readonly logger: ILogger,
		@inject(TYPES.UserController) private readonly usersController: UserController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
		@inject(TYPES.ConfigService) private readonly configService: IConfigService
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes() {
		this.app.use("/users", this.usersController.router);
	}

	useMiddlewares() {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на https://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}

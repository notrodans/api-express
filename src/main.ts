import { UserController } from "./users/users.controller";
import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { Container, ContainerModule, interfaces } from "inversify";
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exception-filter.interface";
import { ILogger } from "./logger/logger.interface";
import { IUsersService } from "./users/users.service.interface";
import { IUserController } from "./users/users.interface";
import { UserService } from "./users/users.service";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { UsersRepository } from "./users/users.repository";
import { ExceptionFilter } from "./errors/exception.filter";

type BootstrapReturn = Promise<{ app: App; appContainer: Container }>;

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUsersService>(TYPES.UserService).to(UserService);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): BootstrapReturn {
	const appContainer = new Container({});
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();

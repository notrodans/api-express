import { UserController } from "./users/users.controller"
import { App } from "./app"
import { LoggerService } from "./logger/logger.service"
import { ExceptionFilter } from "./errors/exception.filter"
import { Container, ContainerModule, interfaces } from "inversify"
import { TYPES } from "./types"
import { IExceptionFilter } from "./errors/exception-filter.interface"
import { ILogger } from "./logger/logger.interface"
import { IUserService } from "./users/users.service.interface"
import { IUserController } from "./users/users.interface"
import { UserService } from "./users/users.service"

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService)
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<IUserController>(TYPES.UserController).to(UserController)
	bind<IUserService>(TYPES.UserService).to(UserService)
	bind<App>(TYPES.Application).to(App)
})

function bootstrap() {
	const appContainer = new Container({})
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
	return { app, appContainer }
}

export const { app, appContainer } = bootstrap()

import { UserController } from "./users/users.controller"
import { App } from "./app"
import { LoggerService } from "./logger/logger.service"
import { ExceptionFilter } from "./errors/exception.filter"
import { Container } from "inversify"
import { ILogger } from "./logger/logger.interface"
import { TYPES } from "./types"
import { IExceptionFilter } from "./errors/exception-filter.interface"

function bootstrap() {
	const appContainer = new Container({})
	appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService)
	appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	appContainer.bind<UserController>(TYPES.UserControoler).to(UserController)
	appContainer.bind<App>(TYPES.Application).to(App)
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
}

export { app, appContainer }

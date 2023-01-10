import { verify } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { IMiddleware } from "./middleware.interface"

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(" ")[1]
			verify(token, this.secret, (err, payload) => {
				if (err) {
					next()
				} else if (payload && typeof payload === "object") {
					req.user = payload.email
					next()
				}
			})
		} else {
			next()
		}
	}
}

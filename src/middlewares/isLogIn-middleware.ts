import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const isLogInMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header) {
        next()
    }

    if (header) {
        const token = header.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        if (userId) {
            // @ts-ignore
            req.user = userId
            next()
        } else {
            res.send(401)
        }
    }
}



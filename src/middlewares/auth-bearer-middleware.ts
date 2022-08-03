import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization

    if (!header) {
        res.send(401)
        return
    }

    const token = header.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if(userId) {
        // @ts-ignore
        req.user = await usersService.findUserById(userId)
        debugger
        next()
    } else {
        res.send(401)
    }
}


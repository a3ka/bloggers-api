import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const ownershipValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization!.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if(userId) {
        // @ts-ignore
        req.user = await usersService.findUserById(userId)
        next()
    } else {
        res.send(401)
    }
}


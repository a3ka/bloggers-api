import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization
    if (header === 'Basic YWRtaW46cXdlcnR5') {
        next()
        return
    }
    res.send(401)
}

import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";



export const authRouter = Router({})

authRouter.post('/login',
    // fieldsValidationMiddleware.loginValidation,
    // fieldsValidationMiddleware.passwordValidation,
    // inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)

        if (!user) {
            res.send(401)
            return
        }

        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
    }
)







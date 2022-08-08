import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import {authService} from "../domain/auth-service";



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

authRouter.post('/registration',
    // fieldsValidationMiddleware.loginValidation,
    // fieldsValidationMiddleware.emailValidation,
    // fieldsValidationMiddleware.passwordValidation,
    // inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)

        res.status(200).send(userRegistration)

    }
)

// authRouter.post('/registration-confirmation',
//
//     async (req: Request, res: Response) => {
//         const userRegistration = await usersService.userRegistration(req.body.login, req.body.email, req.body.password)
//     }
// )

// authRouter.post('/registration-email-resending',
//     fieldsValidationMiddleware.emailValidation,
//     inputValidationMiddleware,
//
//     async (req: Request, res: Response) => {
//         const userRegistration = await usersService.userRegistration(req.body.login, req.body.email, req.body.password)
//     }
// )







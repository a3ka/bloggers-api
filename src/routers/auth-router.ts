import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authService} from "../domain/auth-service";
import {usersRepository} from "../repositories/users-db-repository";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIPAttempts-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    fieldsValidationMiddleware.loginValidation,
    fieldsValidationMiddleware.passwordValidation,
    inputValidationMiddleware,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)

        if (!user) {
            res.send(401)
            return
        }
        // @ts-ignore
        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
    }
)

authRouter.post('/registration',
    fieldsValidationMiddleware.loginValidation,
    fieldsValidationMiddleware.emailValidation,
    fieldsValidationMiddleware.passwordValidation,
    inputValidationMiddleware,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {

        const isEmail = await usersRepository.findUserByEmail(req.body.email)
        const isLogin = await usersRepository.findUserByLogin(req.body.login)

        // @ts-ignore
        if (!!isEmail && isEmail.email) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
            return false
        }

        // @ts-ignore
        if (isLogin && isLogin.login) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "login"}]})
            return false
        }

        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)
    }
)

authRouter.post('/registration-confirmation',
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        // @ts-ignore
        const result = await authService.userRegConfirmation(req.query.code)

        if (result) {
            res.status(200).send()
        } else {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "code"}]})
        }
    }
)

authRouter.post('/registration-email-resending',
    fieldsValidationMiddleware.emailValidation,
    inputValidationMiddleware,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {

        const email = await usersRepository.findUserByEmail(req.body.email)

        if (!!email && email.isConfirmed === true) {

            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
            return
        }

        const result = await authService.resendingEmailConfirm(req.body.email)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)







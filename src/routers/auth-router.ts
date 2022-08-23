import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authService} from "../domain/auth-service";
import {usersRepository} from "../repositories/users-db-repository";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIPAttempts-middleware";
import {authBearerMiddleware} from "../middlewares/auth-bearer-middleware";

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
        const jwtTokenPair = await jwtService.createJWTPair(user)


        res.cookie('refreshToken', jwtTokenPair.refreshToken, {
            httpOnly: true,
            secure: true
            // secure: process.env.NODE_ENV === "production",
        })

        res.status(200).send({accessToken: jwtTokenPair.accessToken})
    }
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {


        const refreshToken = await req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        let tokenExpTime = await jwtService.getTokenExpTime(refreshToken)
        // if (tokenExpTime < +(new Date())) return res.sendStatus(401)
        if (!tokenExpTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)


        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        const user = {id: ""}
        user.id = await jwtService.getUserIdByToken(refreshToken)
        if (user.id === null) res.sendStatus(401)

        const jwtTokenPair = await jwtService.createJWTPair(user)
        res.cookie('refreshToken', jwtTokenPair.refreshToken, {
            httpOnly: true,
            secure: true
            // secure: process.env.NODE_ENV === "production",
        })

        await authService.addRefreshTokenToBlackList(refreshToken)

        res.status(200).send(jwtTokenPair.accessToken)
        // res.status(200).send("New RefreshToken was sent")
    }
)

authRouter.post('/logout', async (req: Request, res: Response) => {

        const refreshToken = await req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        let tokenExpTime = await jwtService.getTokenExpTime(refreshToken)
        if (!tokenExpTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        await authService.addRefreshTokenToBlackList(refreshToken)
        res.sendStatus(204)

    }
)

authRouter.get('/me',
    authBearerMiddleware,
    async (req: Request, res: Response) => {

        debugger
        const header = req.headers.authorization
        if (!header) return res.sendStatus(401)

        const token = header!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        const user = await authService.findUserById(userId)

        if (user) {
            res.status(200).send(user)
        } else {
            res.sendStatus(401)
        }
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
        }

        // @ts-ignore
        if (isLogin && isLogin.login) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "login"}]})
        }

        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)
    }
)

authRouter.post('/registration-confirmation',
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        // @ts-ignore
        const result = await authService.userRegConfirmation(req.body.code)

        if (result) {
            res.status(204).send()
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


        const user = await usersRepository.findUserByEmail(req.body.email)

        if (user?.isConfirmed === true || !user) {

            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
        } else {
            const result = await authService.resendingEmailConfirm(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }
    }
)







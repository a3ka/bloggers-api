import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersService} from "../domain/bloggers-service";



export const authRouter = Router({})

authRouter.post('/login',
    authMiddleware,
    fieldsValidationMiddleware.loginValidation,
    fieldsValidationMiddleware.passwordValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        // const createBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        // res.status(201).send(newBlogger)
    }
)







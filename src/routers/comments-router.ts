import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersService} from "../domain/bloggers-service";
import {usersService} from "../domain/users-service";



export const commentsRouter = Router({})

commentsRouter.post('/login',
    authMiddleware,
    fieldsValidationMiddleware.loginValidation,
    fieldsValidationMiddleware.passwordValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        // const createUser = await usersService.createBlogger(req.body.name, req.body.youtubeUrl)
        // res.status(201).send(newBlogger)
    }
)







import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authBaseMiddleware} from "../middlewares/auth-base-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})


usersRouter.get('/',
    async (req: Request, res: Response) => {

        // @ts-ignore
        const users = await usersService.getAllUsers(req.query.PageNumber, req.query.PageSize)
        res.status(200).send(users);
    }
)

usersRouter.post('/',
    authBaseMiddleware,
    fieldsValidationMiddleware.loginValidation,
    fieldsValidationMiddleware.passwordValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    }
)


usersRouter.delete('/:id',
    authBaseMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)



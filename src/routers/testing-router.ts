import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-db-repository";
import {usersRepository} from "../repositories/users-db-repository";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {commentsRepository} from "../repositories/comments-db-repository";



export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {

            const delAllPost = await postsRepository.deleteAllPost()

            const delAllUsers = await usersRepository.deleteAllUsers()

            const delAllBloggers = await bloggersRepository.deleteAllBloggers()
            const delAllComments = await commentsRepository.deleteAllComments()

        res.sendStatus(204)
    }
)







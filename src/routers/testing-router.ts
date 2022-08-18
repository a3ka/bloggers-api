import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-db-repository";
import {usersRepository} from "../repositories/users-db-repository";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {commentsRepository} from "../repositories/comments-db-repository";
import {attemptsRepository} from "../repositories/attempts-db-repository";
import {refreshTokensBLRepository} from "../repositories/refreshTokekensBL-db-repository";


export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await postsRepository.deleteAllPost()
        await usersRepository.deleteAllUsers()
        await bloggersRepository.deleteAllBloggers()
        await commentsRepository.deleteAllComments()
        await attemptsRepository.deleteAllAttempts()
        await refreshTokensBLRepository.deleteAllTokensInBlackList()

        res.sendStatus(204)
    }
)







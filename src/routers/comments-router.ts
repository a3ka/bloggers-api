import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBaseMiddleware} from "../middlewares/auth-base-middleware";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsService} from "../domain/posts-service";
import {postsRouter} from "./posts-router";
import {authBearerMiddleware} from "../middlewares/auth-bearer-middleware";
import {commentsService} from "../domain/comments-service";
import {CommentContentType, CommentType} from "../repositories/db";


export const commentsRouter = Router({})

commentsRouter.put('/:commentId',
    authBearerMiddleware,
    fieldsValidationMiddleware.commentContentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const comment: CommentType | null | undefined = await commentsService.findComment(req.params.commentId)

        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) {
            res.send(401)
        } else {
            if (comment.userId !== userId) {
                res.status(403).send({errorsMessages: [{message: "It's not your post", field: "userId"}]});
                return
            }
        }

        const updatedComment = await commentsService.updateComment(req.params.commentId, req.body.content)

        if (updatedComment) {
            res.status(204).send(updatedComment);
        } else {
            res.send(400)
        }
    }
)


commentsRouter.delete('/:commentId', authBearerMiddleware, async (req: Request, res: Response) => {

        const comment: CommentType | null | undefined = await commentsService.findComment(req.params.commentId)

        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) {
            res.send(401)
        } else {
            if (comment.userId !== userId) {
                res.status(403).send({errorsMessages: [{message: "It's not your comment", field: "userId"}]});
                return
            }
        }

        const isDeleted = await commentsService.deleteComment(req.params.commentId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {

        if (typeof req.params.commentId !== "string") {
            res.send(400);
            return;
        }

        const auth = req.headers.authorization

        if (!auth) {
            const comment = await commentsService.findComment(req.params.commentId)

            if (comment) {
                res.status(200).send(comment);
            } else {
                res.send(404);
            }
        }

        if (auth) {
            const token = auth.split(' ')[1]
            const userId = await jwtService.getUserIdByToken(token)

            const comment = await commentsService.findComment(req.params.commentId, userId)


            if (comment) {
                res.status(200).send(comment);
            } else {
                res.send(404);
            }
        }

    }
)

commentsRouter.put('/:commentId/like-status',
    authBearerMiddleware,
    fieldsValidationMiddleware.likeStatusValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        // @ts-ignore
        console.log("1-user: " + req.user)
        const comment = await commentsService.findComment(req.params.commentId)
        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }
        // @ts-ignore
        await commentsService.updateLikeStatus(req.user, req.params.commentId, req.body.likeStatus)
        res.sendStatus(204)
    }
)








import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authBaseMiddleware} from "../middlewares/auth-base-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {authBearerMiddleware} from "../middlewares/auth-bearer-middleware";
import {commentsService} from "../domain/comments-service";
import {CommentType} from "../repositories/db";
import {jwtService} from "../application/jwt-service";
import {commentsRouter} from "./comments-router";
import {usersService} from "../domain/users-service";
import {isLogInMiddleware} from "../middlewares/isLogIn-middleware";
import {bloggersService} from "../domain/bloggers-service";


export const postsRouter = Router({});


postsRouter.get('/',
    isLogInMiddleware,

    async (req: Request, res: Response) => {

        // @ts-ignore
        if (req.user) {
            // @ts-ignore
            const posts = await postsService.getAllPosts(req.query.PageNumber, req.query.PageSize, req.user)
            res.status(200).send(posts);
        } else {
            // @ts-ignore
            const posts = await postsService.getAllPosts(req.query.PageNumber, req.query.PageSize)
            res.status(200).send(posts);
        }
    }
)

postsRouter.post('/',
    authBaseMiddleware,
    fieldsValidationMiddleware.titleValidation,
    fieldsValidationMiddleware.shortDescriptionValidation,
    fieldsValidationMiddleware.contentValidation,
    fieldsValidationMiddleware.bloggerIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if (!newPost) {
            res.status(400).send(
                {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            return
        }

        res.status(201).send(newPost)
    }
)

postsRouter.put('/:postId',
    authBaseMiddleware,
    fieldsValidationMiddleware.titleValidation,
    fieldsValidationMiddleware.shortDescriptionValidation,
    fieldsValidationMiddleware.contentValidation,
    fieldsValidationMiddleware.bloggerIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {


        const blogger = await bloggersRepository.isBlogger(req.body.bloggerId);

        if (!blogger) {
            res.status(400).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
            return
        }

        const isUpdated = await postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if (isUpdated) {
            const blogPost = await postsService.getPostById(req.params.postId)
            res.status(204).send(blogPost);
        } else {
            res.send(404)
        }
    }
)

postsRouter.get('/:postId', async (req: Request, res: Response) => {

        if (typeof req.params.postId !== "string") {
            res.send(400);
            return;
        }

        const auth = req.headers.authorization

        if (!auth) {
            const post = await postsService.getPostById(req.params.postId)

            if (post) {
                res.status(200).send(post);
            } else {
                res.send(404);
            }
        }

        if (auth) {

            const token = auth.split(' ')[1]
            const userId = await jwtService.getUserIdByToken(token)

            const post = await postsService.getPostById(req.params.postId, userId)

            if (post) {
                res.status(200).send(post);
            } else {
                res.send(404);
            }
        }
    }
)

postsRouter.delete('/:postId', authBaseMiddleware, async (req: Request, res: Response) => {

        const isDeleted = await postsService.deletePost(req.params.postId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    fieldsValidationMiddleware.commentContentValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {

        const post = await postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }

        // @ts-ignore
        const newComment = await commentsService.createCommentByPostId(req.user, req.params.postId, req.body.content)
        res.status(201).send(newComment)
    }
)

postsRouter.get('/:postId/comments',
    isLogInMiddleware,
    async (req: Request, res: Response) => {
        const post = await postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({
                errorsMessages: [{
                    message: "Post with specified postId doesn't exists",
                    field: "postId"
                }]
            });
        }

        // @ts-ignore
        if (!req.user) {
            // @ts-ignore
            const comments = await commentsService.getAllCommentsByPostId(req.params.postId, req.query.PageNumber, req.query.PageSize)
            res.status(200).send(comments)
        }

        // @ts-ignore
        if (req.user) {
            // @ts-ignore
            const comments = await commentsService.getAllCommentsByPostId(req.params.postId, req.query.PageNumber, req.query.PageSize, req.user)
            res.status(200).send(comments)
        }
    }
)


postsRouter.put('/:postId/like-status',
    authBearerMiddleware,
    fieldsValidationMiddleware.likeStatusValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        // @ts-ignore
        const post = await postsService.getPostById(req.params.postId, req.user)

        if (!post) {
            res.status(404).send({
                errorsMessages: [{
                    message: "Post with specified postId doesn't exists",
                    field: "postId"
                }]
            });
            return
        }

        // @ts-ignore
        const likeStatus = await postsService.updateLikeStatus(req.user, req.params.postId, req.body.likeStatus)

        res.status(204).send(likeStatus)
    }
)







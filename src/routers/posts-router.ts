import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authBaseMiddleware} from "../middlewares/auth-base-middleware";
import {bloggerIdExistenceValidationMiddleware} from "../middlewares/bloggerIdExistence-validation-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bloggersService} from "../domain/bloggers-service";
import {authBearerMiddleware} from "../middlewares/auth-bearer-middleware";
import {postsRepository} from "../repositories/posts-db-repository";
import {commentsService} from "../domain/comments-service";


export const postsRouter = Router({});


postsRouter.get('/', async (req: Request, res: Response) => {
        // @ts-ignore
        const posts = await postsService.getAllPosts(req.query.PageNumber, req.query.PageSize)
        res.status(200).send(posts);
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

        const post = await postsService.getPostById(req.params.postId)

        if (post) {
            res.status(200).send(post);
        } else {
            res.send(404);
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

    async (req: Request, res: Response) => {


        const post = await postsService.getPostById(req.params.postId)

        debugger

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }

        // @ts-ignore
        const newComment = await commentsService.createCommentByPostId(req.user, req.params.postId, req.body.content)

        // if (!newComment) {
        //     res.status(400).send(
        //         {errorsMessages: [{message: "asfdsafsafa", field: "asdfdsf"}]})
        //     return
        // }

        res.status(201).send(newComment)
    }
)




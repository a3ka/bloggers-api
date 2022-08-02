import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bloggerIdExistenceValidationMiddleware} from "../middlewares/bloggerIdExistence-validation-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bloggersService} from "../domain/bloggers-service";


export const postsRouter = Router({});

// const titleValidation = body('title').trim().isLength({min: 1, max: 30}).isString()
// const shortDescriptionValidation = body('shortDescription').trim().isLength({min: 1, max: 100}).isString()
// const contentValidation = body('content').trim().isLength({min: 1, max: 1000}).isString()
// const bloggerIdValidation = body('bloggerId').isNumeric()

// const bloggerIdErrorsMessage = { errorsMessages: [{ message: "wrong blogerId", field: "bloggerId" }] }


postsRouter.get('/', async (req: Request, res: Response) => {
    // @ts-ignore
    const posts = await postsService.getAllPosts(req.query.PageNumber, req.query.PageSize)
    res.status(200).send(posts);
})

postsRouter.post('/',
    authMiddleware,
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
    })

postsRouter.put('/:postId',
    authMiddleware,
    fieldsValidationMiddleware.titleValidation,
    fieldsValidationMiddleware.shortDescriptionValidation,
    fieldsValidationMiddleware.contentValidation,
    fieldsValidationMiddleware.bloggerIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {


        const blogger = await bloggersRepository.isBlogger(+req.body.bloggerId);

        if (!blogger) {
            res.status(400).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
            return
        }

        const isUpdated = await postsService.updatePost(+req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if (isUpdated) {
            const blogPost = await postsService.getPostById(+req.params.postId)
            res.status(204).send(blogPost);
        } else {
            res.send(404)
        }
    })

postsRouter.get('/:postId', async (req: Request, res: Response) => {

    if (typeof +req.params.postId !== "number") {
        res.send(400);
        return;
    }

    const post = await postsService.getPostById(+req.params.postId)

    if (post) {
        res.status(200).send(post);
    } else {
        res.send(404);
    }
})

postsRouter.delete('/:postId', authMiddleware, async (req: Request, res: Response) => {

    const isDeleted = await postsService.deletePost(+req.params.postId)

    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})




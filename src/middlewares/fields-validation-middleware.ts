import {body} from "express-validator";


export const fieldsValidationMiddleware = {
    nameValidation: body('name').trim().isLength({min: 1, max: 15}).isString(),
    youtubeValidation: body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL(),

    titleValidation: body('title').trim().isLength({min: 1, max: 30}).isString(),
    shortDescriptionValidation: body('shortDescription').trim().isLength({min: 1, max: 100}).isString(),
    contentValidation: body('content').trim().isLength({min: 1, max: 1000}).isString(),
    bloggerIdValidation: body('bloggerId').isNumeric(),

    loginValidation: body('login').trim().isLength({min: 3, max: 10}).isString(),
    passwordValidation: body('password').trim().isLength({min: 6, max: 20}).isString(),
    emailValidation: body('email').trim().isString().isEmail(),

    commentContentValidation: body('content').trim().isLength({min: 20, max: 300}).isString(),

    likeStatusValidation: body('likeStatus').isIn(["None", "Like", "Dislike"])

}

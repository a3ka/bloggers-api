import {body} from "express-validator";


export const fieldsValidationMiddleware = {
    nameValidation: body('name').trim().isLength({min: 1, max: 15}).isString(),
    youtubeValidation: body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL(),

    titleValidation: body('title').trim().isLength({min: 1, max: 30}).isString(),
    shortDescriptionValidation: body('shortDescription').trim().isLength({min: 1, max: 100}).isString(),
    contentValidation: body('content').trim().isLength({min: 1, max: 1000}).isString(),
    bloggerIdValidation: body('bloggerId').isNumeric(),

    // bloggerIdErrorsMessage: { errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}] }


}

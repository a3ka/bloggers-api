import {Request, Response, Router} from "express";
import nodemailer from "nodemailer";
import {emailAdapter} from "../adapters/email-adapter";

export const emilRouter = Router({})

emilRouter.post('/send',

    async (req: Request, res: Response) => {

        emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message)

        res.send({
            "email": req.body.email,
            "message": req.body.message,
            "subject": req.body.subject
        })
    }
)

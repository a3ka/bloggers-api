//const express = require('express')
import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from "./routers/bloggers-router";
import {postsRouter} from "./routers/posts-router";
import {runDb} from "./repositories/db";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import { usersRouter } from './routers/users-router';

const app = express()
app.use(cors())
app.use(bodyParser())

const port = process.env.PORT || 5000

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();




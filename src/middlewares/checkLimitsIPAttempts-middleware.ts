import {NextFunction, Request, Response} from "express";
import {attemptsRepository} from "../repositories/attempts-db-repository";

const LIMIT_OF_ATTEMPTS = 10 * 1000

export const checkLimitsIPAttemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip
    // console.log(ip)
    const url = req.url
    const currentTime: Date = new Date()
    const limitTime: Date = new Date(currentTime.getTime() - LIMIT_OF_ATTEMPTS)

    const countOfAttempts = await attemptsRepository.getLastAttempts(ip, url, limitTime)

    await attemptsRepository.addAttempt(ip, url, currentTime)

    if(countOfAttempts! < 5 ) {
        next()
    } else {
        res.sendStatus(429)
    }
}


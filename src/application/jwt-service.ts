import {UsersWithPassType} from "../repositories/db";
import jwt from 'jsonwebtoken'

export const jwtService = {

    async createJWTPair(user: UsersWithPassType) {
        // @ts-ignore
        const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {
            expiresIn: 10
        })

        const refreshToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {
            expiresIn: 20
        })

        const jwtTokenPair = {accessToken, refreshToken}

        return jwtTokenPair
    },

    async getUserIdByToken (token: string) {
        try {
            // @ts-ignore
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            // return new ObjectId(result.userId)
            return result.userId
        } catch (error) {
            return null
        }
    }

}

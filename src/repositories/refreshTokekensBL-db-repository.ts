import {refreshTokensBlackListCollection} from "./db";

export const refreshTokensBLRepository = {

    async addRefreshTokenToBlackList(token: string) {
        // @ts-ignore
        const result = await refreshTokensBlackListCollection.insertOne({refreshToken: token})
        return result
    },

    async checkTokenInBlackList(refreshToken: string) {
        const result  = await refreshTokensBlackListCollection.findOne({refreshToken}, {projection: {_id: 0}})
        if(result === null) {
            return false
        } else {
            return result
        }
    },

    async deleteAllTokensInBlackList(): Promise<boolean> {
        await refreshTokensBlackListCollection.deleteMany({})
        return true
    }

}



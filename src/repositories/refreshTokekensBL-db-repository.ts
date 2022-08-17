import {
    AttemptType,
    bloggersCollection,
    BloggersExtendedType,
    BloggersType, endpointsAttemptsTrysCollection,
    postCollection,
    PostsOfBloggerType,
    PostType, refreshTokensBlackListCollection,
    usersCollection,
    usersEmailConfDataCollection,
    UsersEmailConfDataType,
    UsersExtendedType,
    UsersType,
    UsersWithPassType
} from "./db";


export const refreshTokensBLRepository = {

    async addRefreshTokenToBlackList(token: string) {
        // @ts-ignore
        const result = await refreshTokensBlackListCollection.insertOne(token)

        return result
    },

    async checkTokenInBlackList(refreshToken: string) {
        const result  = await refreshTokensBlackListCollection.findOne({refreshToken}, {projection: {_id: 0}})

        return result;
    }

}



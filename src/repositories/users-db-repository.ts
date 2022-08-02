import {
    bloggersCollection,
    BloggersExtendedType,
    BloggersType,
    postCollection,
    PostsOfBloggerType,
    PostType, usersCollection, UsersExtendedType, UsersType, UsersWithPassType
} from "./db";


export const usersRepository = {

    async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersExtendedType | undefined | null> {

        // @ts-ignore
        const users = await usersCollection.find({}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

        const bloggersCount = await usersCollection.count({})
        const pagesCount = Math.ceil(bloggersCount / pageSize)

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: bloggersCount,
            items: users
        }
        // @ts-ignore
        return result

    },

    async createUser(newUser: UsersWithPassType): Promise<UsersType> {
        const result = await usersCollection.insertOne(newUser)
        const user = await usersCollection.findOne({id: newUser.id}, {projection: {_id: 0, password: 0}})

        // @ts-ignore
        return user;
    },

    async getUserAccessDataByLogin(login: string): Promise<UsersWithPassType> {
        const user = await usersCollection.findOne({login: login}, {projection: {_id: 0}})
        // @ts-ignore
        return user
    },

    async deleteUser(id: number): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }


}



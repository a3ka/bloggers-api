import {
    bloggersCollection,
    BloggersExtendedType,
    BloggersType,
    postCollection,
    PostsOfBloggerType,
    PostType,
    usersCollection,
    usersEmailConfDataCollection,
    UsersEmailConfDataType,
    UsersExtendedType,
    UsersType,
    UsersWithPassType
} from "./db";


export const usersRepository = {

    async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersExtendedType | undefined | null> {

        // @ts-ignore
        const users = await usersCollection.find({}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

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
        const user = await usersCollection.findOne({id: newUser.id}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})

        // @ts-ignore
        return user;
    },

    async findUserByLogin(login: string): Promise<UsersWithPassType | boolean> {
        const user = await usersCollection.findOne({login: login}, {projection: {_id: 0, email: 0, isConfirmed: 0}})

        if(user === null) return false
        // @ts-ignore
        return user
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async findUserById(userId: string): Promise<UsersType> {
        const user = await usersCollection.findOne({id: userId}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
        // @ts-ignore
        return user
    },

    async findUserByEmail(email: string){

        const emailData = await usersEmailConfDataCollection.findOne({email}, {projection: {_id: 0}})

        const accountData = await usersCollection.findOne({email}, {projection: {_id: 0, password: 0}})

        const user = {
            accountData,
            emailConfirmation: emailData
        }

        if(accountData === null) return false

        return accountData
    },

    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await usersEmailConfDataCollection.findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})

        const accountData = await usersCollection.findOne({email: emailData?.email}, {projection: {_id: 0}})

        const user = {
            accountData,
            emailConfirmation: emailData
        }
        // @ts-ignore
        return user
    },

    async insertToDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataCollection.insertOne(newUserEmail)
        return result.acknowledged  ;
    },

    async updateUnconfirmedEmailData(updatedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {


        const result = await usersEmailConfDataCollection.updateOne({email: updatedEmailConfirmationData.email}, {$set: {confirmationCode: updatedEmailConfirmationData.confirmationCode, expirationDate: updatedEmailConfirmationData.expirationDate}})

        return result.acknowledged  ;
    },

    async deleteUserUnconfirmedEmail(email: string): Promise<boolean> {
        const result = await usersEmailConfDataCollection.deleteOne({email})
        return result.deletedCount === 1
    },

    async updateEmailConfirmation(email: string): Promise<UsersType | null> {

        const accountDataRes = await usersCollection.updateOne({email}, {$set: {isConfirmed: true}})

        if (accountDataRes) {
            await usersEmailConfDataCollection.deleteOne({email})
            return null
        }

        return await usersCollection.findOne({email}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
    },

    async deleteAllUsers(): Promise<boolean> {
        const resultUser = await usersCollection.deleteMany({})
        const resultUsEm = await usersEmailConfDataCollection.deleteMany({})

        return true
    }


}



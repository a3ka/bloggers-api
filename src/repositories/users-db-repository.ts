import {
    UsersModel,
    usersEmailConfDataModel,
    UsersEmailConfDataType,
    UsersExtendedType,
    UsersType, UsersWithEmailType,
    UsersWithPassType
} from "./db";

export class UsersRepository {
    async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersExtendedType | undefined | null> {

        debugger
        // @ts-ignore
        const users = await UsersModel.find({}, {_id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0}).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        const bloggersCount = await UsersModel.count({})
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
    }

    async createUser(newUser: UsersWithPassType): Promise<UsersType> {
        debugger
        // @ts-ignore
        await UsersModel.insertMany([newUser])
        // await usersCollection.insertOne(newUser)
        const user = await UsersModel.findOne({id: newUser.id}, {_id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0})

        // @ts-ignore
        return user;
    }

    async findUserByLogin(login: string): Promise<UsersWithPassType | boolean> {
        debugger
        const user = await UsersModel.findOne({login: login}, {_id: 0, email: 0, isConfirmed: 0, __v: 0})

        if(user === null) return false
        // @ts-ignore
        return user
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UsersModel.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async findUserById(userId: string): Promise<UsersType> {
        const user = await UsersModel.findOne({id: userId}, {_id: 0, password: 0, email: 0, isConfirmed: 0, __v: 0})
        // @ts-ignore
        return user
    }

    async findUserWithEmailById(userId: string): Promise<UsersWithEmailType> {
        const user = await UsersModel.findOne({id: userId}, {_id: 0, password: 0, isConfirmed: 0, __v: 0})
        // @ts-ignore
        return user
    }

    async findUserByEmail(email: string){

        const user = await UsersModel.findOne({email}, {_id: 0, password: 0})

        return user
    }

    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await usersEmailConfDataModel.findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})

        const accountData = await UsersModel.findOne({email: emailData?.email}, {projection: {_id: 0}})

        if(emailData === null && accountData === null) {
            const user = {
                accountData: undefined,
                emailConfirmation: undefined
            }
            return user
        } else {
            const user = {
                accountData,
                emailConfirmation: emailData
            }
            return user
        }
    }

    async insertToDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataModel.insertMany([newUserEmail])
        // return result.acknowledged  ;
        if(result){
            return true
        } else {
            return false
        }
    }

    async updateUnconfirmedEmailData(updatedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {

        const result = await usersEmailConfDataModel.updateOne({email: updatedEmailConfirmationData.email}, {$set: {confirmationCode: updatedEmailConfirmationData.confirmationCode, expirationDate: updatedEmailConfirmationData.expirationDate}})

        return result.acknowledged  ;
    }

    async deleteUserUnconfirmedEmail(email: string): Promise<boolean> {
        const result = await usersEmailConfDataModel.deleteOne({email})
        return result.deletedCount === 1
    }

    async updateEmailConfirmation(email: string): Promise<UsersType | null> {

        const accountDataRes = await UsersModel.updateOne({email}, {$set: {isConfirmed: true}})

        if (!accountDataRes) {
            return null
        } else {
            await usersEmailConfDataModel.deleteOne({email})
            const result = await UsersModel.findOne({email}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
            return result
        }
    }

    async deleteAllUsers(): Promise<boolean> {
        await UsersModel.deleteMany({})
        await usersEmailConfDataModel.deleteMany({})
        return true
    }
}

export const usersRepository = new UsersRepository()


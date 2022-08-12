import {usersRepository} from "../repositories/users-db-repository";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'


export const authService = {

    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user) return false
        // @ts-ignore
        if (user.password !== password) {
            return false
        }
        return user
    },

    async userRegistration(login: string, email: string, password: string) {
        // Registration in DataBase
        const newUser = {
            accountData: {
                id: (+(new Date())).toString(),
                login,
                password,
                email: email,
                isConfirmed: false
            },
            emailConfirmation: {
                email,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 3,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        await usersRepository.createUser(newUser.accountData)
        await usersRepository.insertToDbUnconfirmedEmail(newUser.emailConfirmation)

        try {
            await emailManager.sendEmailConfirmationCode(email, newUser.emailConfirmation.confirmationCode)
        } catch (err) {
            console.error(err)
            usersRepository.deleteUser(newUser.accountData.id)
            usersRepository.deleteUserUnconfirmedEmail(newUser.emailConfirmation.email)
            return null
        }
        return true
    },

    async userRegConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmCode(confirmationCode)
        debugger
        // if (!user.emailConfirmation) return false
        // if (user.accountData?.isConfirmed === true) return false
        // if (user.emailConfirmation?.confirmationCode !== confirmationCode) return false
        // if (user.emailConfirmation?.expirationDate < new Date()) return false
        // debugger

        if (!!user.emailConfirmation ) {

            await usersRepository.updateEmailConfirmation(user.emailConfirmation.email)

            debugger
            return true
        } else {
            return false
        }
    },

    async resendingEmailConfirm(email: string) {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) return false
        if (user?.isConfirmed === true) return false

        const newEmailConfirmation = {
            email,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 3,
                minutes: 3
            }),
            isConfirmed: false
        }

        await usersRepository.updateUnconfirmedEmailData(newEmailConfirmation)

        await emailManager.sendEmailConfirmationCode(email, newEmailConfirmation.confirmationCode)

        return true

    }
}

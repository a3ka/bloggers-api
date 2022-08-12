import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendEmailRecoveryMessage(user:any) {
        await emailAdapter.sendEmail("user.email", "password.recovery", "<div>${user.recoveryCode} message </div>")
    },

    async sendEmailConfirmationCode(email: string, confirmationCode: string) {

        await emailAdapter.sendEmail(email, "Confirm your Email", ` <div> Confirm your Email: <a href='http://localhost:5000/auth/registration-confirmation?code=${confirmationCode}'>Click here</a> </div>`)
    }
}


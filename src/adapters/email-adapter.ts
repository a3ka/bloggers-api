import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "akdev6451@gmail.com", // generated ethereal user
                pass: process.env.EMAILPASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <akdev6451@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });

        console.log(info)
        return info
    }
}

import fs from "fs"
import path from "path"
import mailer from "nodemailer"
import handlebars from "handlebars"

import logger from "./logger.util"
import { ResetPasswordEmailPayload, VerificationEmailPayload } from "./types.util";

const SMTP_USER = String(process.env.SMTP_USER)
const SMTP_PASS = String(process.env.SMTP_PASS)
const SMTP_HOST = String(process.env.SMTP_HOST)
const SMTP_PORT = Number(process.env.SMTP_PORT)

export default class Mailer {
    private readonly from
    private readonly to

    constructor(from: string, to: string) {
        this.from = from
        this.to = to
    }

    newTransport(options?: object): mailer.Transporter {
        return mailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
            pool: true,
            ...options,
        })
    }

    async sendResetPasswordMail(payload: ResetPasswordEmailPayload) {
        await this.sendTemplateMail(this.from, this.to, "Password Reset", payload, "password-reset.hbs")
    }

    async sendVerifyAccountMail(payload: VerificationEmailPayload) {
        await this.sendTemplateMail(
            this.from,
            this.to,
            "Account Verification",
            payload,
            "account-verification.hbs"
        )
    }

    async sendTemplateMail(
        from: string,
        to: string,
        subject: string,
        payload: any,
        template: string
    ) {
        fs.readFile(path.join(__dirname, "..", "..", "assets", "mail", template), (err, source) => {
            if (!err) {
                const compiledTemplate = handlebars.compile(String(source))
                const options: mailer.SendMailOptions = {
                    from: from,
                    to: to,
                    subject: subject,
                    html: compiledTemplate(payload),
                }

                this.newTransport().sendMail(options, (error, info) => {
                    if (error) logger.error(JSON.stringify(error))
                    if (info) logger.info(`E-Mail sent to (${to})`)
                })
            }
        })
    }
}

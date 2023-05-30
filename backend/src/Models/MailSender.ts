import { createTransport } from "nodemailer"

export type MailSenderType = {
    sourceEmail: string
    sourceEmailPassword: string
    service: string
    destinationEmail: string
    subject: string
    contentText?: string
    contentHTML?: string
}

export default class MailSender {
    private sourceEmail: string
    private sourceEmailPassword: string
    private service: string
    private destinationEmail: string
    private subject: string
    private contentText?: string
    private contentHTML?: string

    constructor(params: MailSenderType){
        this.sourceEmail = params.sourceEmail
        this.sourceEmailPassword = params.sourceEmailPassword
        this.service = params.service
        this.destinationEmail = params.destinationEmail
        this.subject = params.subject
        this.contentText = params.contentText
        this.contentHTML = params.contentHTML
    }
    
    public async sendEmail(){
        const transporter = this.createTransporter()
        await transporter.sendMail({
            from: this.sourceEmail,
            to: this.destinationEmail,
            subject: this.subject,
            text: this.contentText,
            html: this.contentHTML
        })
    }

    private createTransporter(){
        return createTransport({
            service: this.service,
            auth: {
                user: this.sourceEmail,
                pass: this.sourceEmailPassword
            }
        })
    }
}
import { createTransport } from "nodemailer"
export default class MailSender {
    private sourceEmail: string
    private sourceEmailPassword: string
    private service: string
    private destinationEmail: string

    constructor(destinationEmail: string){
        if(process.env.SOURCE_EMAIL === undefined){
            throw new Error('Email de origem não foi definido')
        }
        if(process.env.SOURCE_EMAIL_PASSOWORD === undefined){
            throw new Error('Senha do email de origem não foi definida')
        }
        if(process.env.EMAIL_SERVICE === undefined){
            throw new Error('Serviço de email não definido')
        }
        this.sourceEmail = process.env.SOURCE_EMAIL
        this.sourceEmailPassword = process.env.SOURCE_EMAIL_PASSOWORD
        this.service = process.env.EMAIL_SERVICE
        this.destinationEmail = destinationEmail
    }
    
    public async sendEmail({subject, contentText, contentHTML}: {subject: string, contentText?: string, contentHTML?: string}){
        const transporter = this.createTransporter()
        await transporter.sendMail({
            from: this.sourceEmail,
            to: this.destinationEmail,
            subject: subject,
            text: contentText,
            html: contentHTML
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
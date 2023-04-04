import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import Logger from './Utils/Logger'

dotenv.config()

const app = express()

app.use(express.json())

app.all("/", (req: Request, res: Response) => {
    res.status(200).send('Api is running')
    Logger.error('Ocorreu um erro teste')
})

app.listen(3000, () => {
    console.log(process.env.debug)
    console.log('Api is running on port 3000')
})
import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import { query } from './Services/Database'

dotenv.config()

const app = express()

app.use(express.json())

app.all("/", (req: Request, res: Response) => {
    res.status(200).send('Api is running')
    query("SELECT * FROM teste")
})


app.listen(process.env.PORT, () => {
    console.log(`Api is running on port ${process.env.PORT}`)
})
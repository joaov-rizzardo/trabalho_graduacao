import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import { query } from './Services/Database'
import authenticationRouter from './Routes/AuthenticationRouter'
import profileRouter from './Routes/ProfileRouter'
import transactionRouter from './Routes/TransactionRouter'
import billRouter from './Routes/BillRouter'
import goalRouter from './Routes/GoalRouter'
import managementRouter from './Routes/ManagementRouter'
import morganMiddleware from './Middlewares/MorganMiddleware'

dotenv.config()
const app = express()

app.use(express.json())
app.use(morganMiddleware)

app.all("/", (req: Request, res: Response) => {
    res.status(200).send('Api is running')
    query("SELECT * FROM arooz")
})

app.use('/authentication', authenticationRouter)
app.use('/profile', profileRouter)
app.use('/transaction', transactionRouter)
app.use('/bill', billRouter)
app.use('/goal', goalRouter)
app.use('/management', managementRouter)

app.use((req: Request, res: Response) => {
    res.status(404).send({message: 'The requested route not exists'})
})


app.listen(process.env.PORT, () => {
    console.log(`Api is running on port ${process.env.PORT}`)
})
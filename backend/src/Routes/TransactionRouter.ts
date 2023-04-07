import {Router, Request, Response} from 'express'

const transactionRouter = Router()

transactionRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Transaction service is running')
})

export default transactionRouter
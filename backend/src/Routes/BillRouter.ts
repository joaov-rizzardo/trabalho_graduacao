import {Router, Request, Response} from 'express'

const billRouter = Router()

billRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Bill service is running')
})

export default billRouter
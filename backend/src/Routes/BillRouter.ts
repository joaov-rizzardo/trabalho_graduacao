import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'

const billRouter = Router()
billRouter.use(tokenAuthenticationMiddleware)

billRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Bill service is running')
})

export default billRouter
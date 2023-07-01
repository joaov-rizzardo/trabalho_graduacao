import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'

const managementRouter = Router()

managementRouter.use(tokenAuthenticationMiddleware)

managementRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Management service is running')
})

export default managementRouter
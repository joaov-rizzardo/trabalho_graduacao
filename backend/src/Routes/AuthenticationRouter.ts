import {Router, Request, Response} from 'express'

const authenticationRouter = Router()

authenticationRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Authentication service is running')
})

export default authenticationRouter
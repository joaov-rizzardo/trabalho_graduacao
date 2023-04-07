import {Router, Request, Response} from 'express'

const goalRouter = Router()

goalRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Goal service is running')
})

export default goalRouter
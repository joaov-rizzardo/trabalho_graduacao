import {Router, Request, Response} from 'express'

const managementRouter = Router()

managementRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Management service is running')
})

export default managementRouter
import {Router, Request, Response} from 'express'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

export default profileRouter
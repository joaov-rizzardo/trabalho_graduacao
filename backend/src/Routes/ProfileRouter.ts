import {Router, Request, Response} from 'express'
import { updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

profileRouter.post('/updateProfile', updateProfileValidators, checkExpressValidations)

export default profileRouter
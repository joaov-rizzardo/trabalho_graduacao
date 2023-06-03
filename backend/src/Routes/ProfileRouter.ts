import {Router, Request, Response} from 'express'
import { updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import updateProfileFlow from '../Controllers/updateProfileController'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

profileRouter.post('/updateProfile/:userId', updateProfileValidators, checkExpressValidations, updateProfileFlow)

export default profileRouter
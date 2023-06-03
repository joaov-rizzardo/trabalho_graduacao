import {Router, Request, Response} from 'express'
import { updatePasswordValidators, updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import updateProfileFlow from '../Controllers/updateProfileController'
import updatePasswordFlow from '../Controllers/updatePasswordController'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

profileRouter.post('/updateProfile/:userId', updateProfileValidators, checkExpressValidations, updateProfileFlow)
profileRouter.post('/updatePassword/:userId', updatePasswordValidators, checkExpressValidations, updatePasswordFlow)

export default profileRouter
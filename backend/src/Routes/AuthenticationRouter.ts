import {Router, Request, Response} from 'express'
import signUp from '../Controllers/SignUpController'
import { signUpValidators } from '../Validators/AuthenticationValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'

const authenticationRouter = Router()

authenticationRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Authentication service is running')
})

authenticationRouter.post('/signup', signUpValidators, checkExpressValidations, signUp)

export default authenticationRouter
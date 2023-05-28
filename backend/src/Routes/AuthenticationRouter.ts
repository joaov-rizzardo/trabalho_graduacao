import {Router, Request, Response} from 'express'
import signUp from '../Controllers/SignUpController'
import { signInValidators, signUpValidators } from '../Validators/AuthenticationValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import signIn from '../Controllers/SignInController'

const authenticationRouter = Router()

authenticationRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Authentication service is running')
})

authenticationRouter.post('/signup', signUpValidators, checkExpressValidations, signUp)
authenticationRouter.post('/signin', signInValidators, checkExpressValidations, signIn)

export default authenticationRouter
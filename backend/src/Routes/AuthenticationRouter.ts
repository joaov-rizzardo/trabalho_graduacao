import {Router, Request, Response} from 'express'
import signUp from '../Controllers/SignUpController'
import { checkTokenValidators, checkVerificationCodeValidators, signInValidators, signUpValidators } from '../Validators/AuthenticationValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import signIn from '../Controllers/SignInController'
import checkTokenFlow from '../Controllers/TokenValidatorController'
import { checkEmailVerificationCode, sendEmailVerificationCodeToUser } from '../Controllers/EmailVerificationController'

const authenticationRouter = Router()

authenticationRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Authentication service is running')
})

authenticationRouter.post('/signup', signUpValidators, checkExpressValidations, signUp)
authenticationRouter.post('/signin', signInValidators, checkExpressValidations, signIn)
authenticationRouter.post('/checkToken', checkTokenValidators, checkExpressValidations, checkTokenFlow)
authenticationRouter.post('/sendVerificationCode/:userId', sendEmailVerificationCodeToUser)
authenticationRouter.post('/checkVerificationCode', checkVerificationCodeValidators, checkExpressValidations, checkEmailVerificationCode)

export default authenticationRouter
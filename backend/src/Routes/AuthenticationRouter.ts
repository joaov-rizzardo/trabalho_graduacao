import {Router, Request, Response} from 'express'
import { checkEmailValidators, checkPasswordValidators, checkTokenValidators, checkUserValidators, checkVerificationCodeValidators, signInValidators, signUpValidators } from '../Validators/AuthenticationValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import signIn from '../Controllers/SignInController'
import checkTokenFlow from '../Controllers/TokenValidatorController'
import { checkEmailVerificationCode, sendEmailVerificationCodeToUser } from '../Controllers/EmailVerificationController'
import checkPasswordFlow from '../Controllers/CheckPasswordController'
import signUpFlow from '../Controllers/SignUpController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { checkEmailDisponibility, checkUserDisponibility } from '../Controllers/CheckUserDisponibilityController'

const authenticationRouter = Router()

authenticationRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Authentication service is running')
})

// Rotas que não precisam de autenticação
authenticationRouter.post('/signup', signUpValidators, checkExpressValidations, signUpFlow)
authenticationRouter.post('/signin', signInValidators, checkExpressValidations, signIn)
authenticationRouter.post('/checkToken', checkTokenValidators, checkExpressValidations, checkTokenFlow)
authenticationRouter.post('/checkEmail', checkEmailValidators, checkExpressValidations, checkEmailDisponibility)
authenticationRouter.post('/checkUser', checkUserValidators, checkExpressValidations, checkUserDisponibility)
// Middleware de autenticação
authenticationRouter.use(tokenAuthenticationMiddleware)
// Rotas que requerem autenticação
authenticationRouter.post('/sendVerificationCode', sendEmailVerificationCodeToUser)
authenticationRouter.post('/checkVerificationCode', checkVerificationCodeValidators, checkExpressValidations, checkEmailVerificationCode)
authenticationRouter.post('/checkPassword', checkPasswordValidators, checkExpressValidations, checkPasswordFlow)

export default authenticationRouter
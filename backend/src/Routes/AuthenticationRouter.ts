import {Router, Request, Response} from 'express'
import { checkEmailValidators, checkPasswordValidators, checkTokenValidators, checkUserValidators, checkVerificationCodeValidators, searchUserIdByEmailOrUsernameValidators, signInValidators, signUpValidators, updatePasswordValidators } from '../Validators/AuthenticationValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import signIn from '../Controllers/SignInController'
import checkTokenFlow from '../Controllers/TokenValidatorController'
import { checkEmailVerificationCode, sendEmailVerificationCodeToUser } from '../Controllers/EmailVerificationController'
import checkPasswordFlow from '../Controllers/CheckPasswordController'
import signUpFlow from '../Controllers/SignUpController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { checkEmailDisponibility, checkUserDisponibility } from '../Controllers/CheckUserDisponibilityController'
import findUserByEmailOrUsername from '../Controllers/FindUserController'
import updatePasswordFlow from '../Controllers/UpdatePasswordController'

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
authenticationRouter.post('/searchUserIdByEmailOrUsername', searchUserIdByEmailOrUsernameValidators, checkExpressValidations, findUserByEmailOrUsername)
authenticationRouter.post('/sendVerificationCode/:userId', sendEmailVerificationCodeToUser)
authenticationRouter.post('/checkVerificationCode/:userId', checkVerificationCodeValidators, checkExpressValidations, checkEmailVerificationCode)
authenticationRouter.post('/updatePassword/:userId', updatePasswordValidators, checkExpressValidations, updatePasswordFlow)
// Middleware de autenticação
authenticationRouter.use(tokenAuthenticationMiddleware)
// Rotas que requerem autenticação
authenticationRouter.post('/checkPassword', checkPasswordValidators, checkExpressValidations, checkPasswordFlow)

export default authenticationRouter
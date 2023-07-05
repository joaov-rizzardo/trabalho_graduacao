import {Router, Request, Response} from 'express'
import { updatePasswordValidators, updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import { sendAvatarImage } from '../Controllers/AvatarImageController'
import { getUserAvatarsFlow } from '../Controllers/UserAvatarsController'
import updateProfileFlow from '../Controllers/UpdateProfileController'
import updatePasswordFlow from '../Controllers/UpdatePasswordController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import getBalanceTypesFlow from '../Controllers/BalanceTypesGetterController'

const profileRouter = Router()

profileRouter.use(tokenAuthenticationMiddleware)

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

profileRouter.post('/updateProfile', updateProfileValidators, checkExpressValidations, updateProfileFlow)
profileRouter.post('/updatePassword', updatePasswordValidators, checkExpressValidations, updatePasswordFlow)
profileRouter.get('/userAvatars', getUserAvatarsFlow)
profileRouter.get('/avatar/:avatarId', sendAvatarImage)
profileRouter.get('/balanceTypes', getBalanceTypesFlow)

export default profileRouter
import {Router, Request, Response} from 'express'
import { updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import { sendAvatarImage } from '../Controllers/AvatarImageController'
import { getUserAvatarsFlow } from '../Controllers/UserAvatarsController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import getBalanceTypesFlow from '../Controllers/BalanceTypesGetterController'
import getUserFinanceFlow from '../Controllers/UserFinanceGetterController'
import getUserLevelFlow from '../Controllers/UserLevelGetterController'
import updateProfileFlow from '../Controllers/UpdateProfileController'
import updatePasswordFlow from '../Controllers/UpdatePasswordController'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})
profileRouter.get('/avatar/:avatarId', sendAvatarImage)

profileRouter.use(tokenAuthenticationMiddleware)

profileRouter.post('/updateProfile', updateProfileValidators, checkExpressValidations, updateProfileFlow)
profileRouter.get('/userAvatars', getUserAvatarsFlow)
profileRouter.get('/balanceTypes', getBalanceTypesFlow)
profileRouter.get('/userFinance', getUserFinanceFlow)
profileRouter.get('/userLevel', getUserLevelFlow)

export default profileRouter
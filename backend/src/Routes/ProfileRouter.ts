import {Router, Request, Response} from 'express'
import { updatePasswordValidators, updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import { sendAvatarImage } from '../Controllers/AvatarImageController'
import { getUserAvatarsFlow } from '../Controllers/UserAvatarsController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import getBalanceTypesFlow from '../Controllers/BalanceTypesGetterController'
import updateProfileFlow from '../Controllers/updateProfileController'
import updatePasswordFlow from '../Controllers/updatePasswordController'
import getUserFinanceFlow from '../Controllers/UserFinanceGetterController'
import getUserLevelFlow from '../Controllers/UserLevelGetterController'

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
profileRouter.get('/userFinance', getUserFinanceFlow)
profileRouter.get('/userLevel', getUserLevelFlow)

export default profileRouter
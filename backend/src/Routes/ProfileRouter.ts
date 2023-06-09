import {Router, Request, Response} from 'express'
import { updatePasswordValidators, updateProfileValidators } from '../Validators/ProfileValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import updateProfileFlow from '../Controllers/updateProfileController'
import updatePasswordFlow from '../Controllers/updatePasswordController'
import { sendAvatarImage } from '../Controllers/AvatarImageController'
import { getUserAvatarsFlow } from '../Controllers/UserAvatarsController'

const profileRouter = Router()

profileRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Profile service is running')
})

profileRouter.post('/updateProfile/:userId', updateProfileValidators, checkExpressValidations, updateProfileFlow)
profileRouter.post('/updatePassword/:userId', updatePasswordValidators, checkExpressValidations, updatePasswordFlow)
profileRouter.get('/userAvatars/:userId', getUserAvatarsFlow)
profileRouter.get('/avatar/:avatarId', sendAvatarImage)

export default profileRouter
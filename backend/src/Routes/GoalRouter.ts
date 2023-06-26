import {Router, Request, Response} from 'express'
import { createGoalValidators } from '../Validators/GoalValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createGoalFlow from '../Controllers/CreateGoalController'

const goalRouter = Router()

goalRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Goal service is running')
})

goalRouter.post('/create', createGoalValidators, checkExpressValidations, createGoalFlow)

export default goalRouter
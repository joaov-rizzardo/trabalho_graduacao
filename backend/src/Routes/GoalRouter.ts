import {Router, Request, Response} from 'express'
import { createGoalValidators, investGoalValidators } from '../Validators/GoalValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createGoalFlow from '../Controllers/CreateGoalController'
import investGoalFlow from '../Controllers/InvestGoalController'

const goalRouter = Router()

goalRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Goal service is running')
})

goalRouter.post('/create', createGoalValidators, checkExpressValidations, createGoalFlow)
goalRouter.put('/invest', investGoalValidators, checkExpressValidations, investGoalFlow)

export default goalRouter
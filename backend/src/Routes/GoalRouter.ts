import {Router, Request, Response} from 'express'
import { createGoalValidators, investGoalValidators, recoverInvestmentGoalValidators } from '../Validators/GoalValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createGoalFlow from '../Controllers/CreateGoalController'
import investGoalFlow from '../Controllers/InvestGoalController'
import recoverInvestmentFlow from '../Controllers/RecoverInvestmentController'
import cancelGoalFlow from '../Controllers/CancelGoalController'
import getGoalsFlow from '../Controllers/GoalsGetterController'

const goalRouter = Router()

goalRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Goal service is running')
})

goalRouter.post('/create', createGoalValidators, checkExpressValidations, createGoalFlow)
goalRouter.put('/invest', investGoalValidators, checkExpressValidations, investGoalFlow)
goalRouter.put('/recoverInvestment', recoverInvestmentGoalValidators, checkExpressValidations, recoverInvestmentFlow)
goalRouter.put('/cancel/:goalId', cancelGoalFlow)
goalRouter.get('/get/:userId', getGoalsFlow)

export default goalRouter
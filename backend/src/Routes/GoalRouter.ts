import {Router, Request, Response} from 'express'
import { createGoalValidators, investGoalValidators, recoverInvestmentGoalValidators } from '../Validators/GoalValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createGoalFlow from '../Controllers/CreateGoalController'
import investGoalFlow from '../Controllers/InvestGoalController'
import recoverInvestmentFlow from '../Controllers/RecoverInvestmentController'
import cancelGoalFlow from '../Controllers/CancelGoalController'
import getGoalsFlow from '../Controllers/GoalsGetterController'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'

const goalRouter = Router()

goalRouter.use(tokenAuthenticationMiddleware)

goalRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Goal service is running')
})

goalRouter.post('/create', createGoalValidators, checkExpressValidations, createGoalFlow)
goalRouter.put('/invest', investGoalValidators, checkExpressValidations, investGoalFlow)
goalRouter.put('/recoverInvestment', recoverInvestmentGoalValidators, checkExpressValidations, recoverInvestmentFlow)
goalRouter.put('/cancel/:goalId', cancelGoalFlow)
goalRouter.get('/get', getGoalsFlow)

export default goalRouter
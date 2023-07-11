import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { getLevelRankingFlow, getPointsRankingFlow } from '../Controllers/RankingsController'
import { earningsByCategoryValidators, getTransactionsValidators, spendingsByCategoryValidators } from '../Validators/ManagementValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import getEarningsByCategoryFlow from '../Controllers/EarningsByCategoryController'
import getSpendingsByCategoryFlow from '../Controllers/SpendingsByCategoryController'
import getTransactionsFlow from '../Controllers/TransactionsGetterController'

const managementRouter = Router()

managementRouter.use(tokenAuthenticationMiddleware)

managementRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Management service is running')
})

managementRouter.get('/pointsRanking', getPointsRankingFlow)
managementRouter.get('/levelRanking', getLevelRankingFlow)
managementRouter.post('/earningsByCategory', earningsByCategoryValidators, checkExpressValidations, getEarningsByCategoryFlow)
managementRouter.post('/spendingsByCategory', spendingsByCategoryValidators, checkExpressValidations, getSpendingsByCategoryFlow)
managementRouter.post('/getTransactions', getTransactionsValidators, checkExpressValidations, getTransactionsFlow)

export default managementRouter
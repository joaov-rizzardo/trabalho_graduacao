import {Router, Request, Response} from 'express'
import { earningCreateValidators, earningGetValidators, spendingCreateValidators, spendingGetValidators } from '../Validators/TransactionsValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createSpendingFlow from '../Controllers/SpendingCreateController'
import cancelSpedingFlow from '../Controllers/CancelSpendingController'
import getSpendingFlow from '../Controllers/SpendingGetterController'
import createEarningFlow from '../Controllers/EarningCreateController'
import cancelEarningFlow from '../Controllers/CancelEarningController'
import getEarningsFlow from '../Controllers/EarningGetterControler'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { getEarningCategoriesFlow, getSpendingCategoriesFlow } from '../Controllers/TransactionsCategoriesGetterController'
import getLastAcitivities from '../Controllers/ActivitiesGetterController'

const transactionRouter = Router()

transactionRouter.use(tokenAuthenticationMiddleware)

transactionRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Transaction service is running')
})

transactionRouter.post('/spending/create', spendingCreateValidators, checkExpressValidations, createSpendingFlow)
transactionRouter.put('/spending/cancel/:spendingId', cancelSpedingFlow)
transactionRouter.post('/spending/get', spendingGetValidators, checkExpressValidations, getSpendingFlow)
transactionRouter.post('/earning/create', earningCreateValidators, checkExpressValidations, createEarningFlow)
transactionRouter.put('/earning/cancel/:earningId', cancelEarningFlow)
transactionRouter.post('/earning/get', earningGetValidators, checkExpressValidations, getEarningsFlow)
transactionRouter.get('/earningCategories', getEarningCategoriesFlow)
transactionRouter.get('/spendingCategories', getSpendingCategoriesFlow)
transactionRouter.get('/lastActivities', getLastAcitivities)

export default transactionRouter
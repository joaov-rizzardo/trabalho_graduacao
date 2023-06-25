import {Router, Request, Response} from 'express'
import { earningCreateValidators, spendingCreateValidators, spendingGetValidators } from '../Validators/TransactionsValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createSpendingFlow from '../Controllers/SpendingCreateController'
import cancelSpedingFlow from '../Controllers/CancelSpendingController'
import getSpendingFlow from '../Controllers/SpendingGetterController'
import createEarningFlow from '../Controllers/EarningCreateController'

const transactionRouter = Router()

transactionRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Transaction service is running')
})

transactionRouter.post('/spending/create', spendingCreateValidators, checkExpressValidations, createSpendingFlow)
transactionRouter.put('/spending/cancel/:spendingId', cancelSpedingFlow)
transactionRouter.post('/spending/get/:userId', spendingGetValidators, checkExpressValidations, getSpendingFlow)
transactionRouter.post('/earning/create', earningCreateValidators, checkExpressValidations, createEarningFlow)

export default transactionRouter
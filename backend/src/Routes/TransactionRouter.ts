import {Router, Request, Response} from 'express'
import { spendingCreateValidators } from '../Validators/TransactionsValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createSpendingFlow from '../Controllers/SpendingCreateController'

const transactionRouter = Router()

transactionRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Transaction service is running')
})

transactionRouter.post('/spending/create', spendingCreateValidators, checkExpressValidations, createSpendingFlow)

export default transactionRouter
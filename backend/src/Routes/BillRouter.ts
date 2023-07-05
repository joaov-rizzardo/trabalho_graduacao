import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { createBillValidators, payInstallmentValidators } from '../Validators/BillValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createBillFlow from '../Controllers/CreateBillController'
import payInstallmentFlow from '../Controllers/PayInstallmentController'
import cancelBillFlow from '../Controllers/CancelBillController'
import getActiveBillsFlow from '../Controllers/ActiveBillsGetter'
import getBillTypesFlow from '../Controllers/BillTypesGetterController'

const billRouter = Router()
billRouter.use(tokenAuthenticationMiddleware)

billRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Bill service is running')
})

billRouter.post('/create', createBillValidators, checkExpressValidations, createBillFlow)
billRouter.put('/installment/pay', payInstallmentValidators, checkExpressValidations, payInstallmentFlow)
billRouter.put('/cancel/:billId', cancelBillFlow)
billRouter.get('/activeBills', getActiveBillsFlow)
billRouter.get('/billTypes', getBillTypesFlow)

export default billRouter
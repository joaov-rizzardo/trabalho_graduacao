import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { createBillValidators } from '../Validators/BillValidators'
import checkExpressValidations from '../Middlewares/DefaultExpressValidationsChecker'
import createBillFlow from '../Controllers/CreateBillController'

const billRouter = Router()
billRouter.use(tokenAuthenticationMiddleware)

billRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Bill service is running')
})

billRouter.post('/create', createBillValidators, checkExpressValidations, createBillFlow)
export default billRouter
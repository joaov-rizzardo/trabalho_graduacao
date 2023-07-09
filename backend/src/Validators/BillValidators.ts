import {body} from 'express-validator'
import {BillEnum} from '../Enums/BillEnum'
import { BalanceTypeEnum } from '../Enums/BalanceTypeEnum'
import { SpendingCategoryEnum } from '../Enums/SpendingCategoryEnum'

export const createBillValidators = [
    body('billType')
        .notEmpty().withMessage('The billType field cannot be empty')
        .isString().withMessage('The billType field must be a string')
        .isLength({min: 1, max: 1}).withMessage('The billType field must be a 1 character')
        .isIn(Object.keys(BillEnum)).withMessage('The billType field has a invalid value'),
    body('category')
        .notEmpty().withMessage('The category field cannot be empty')
        .isString().withMessage('The category field must be a string')
        .isLength({min: 2, max: 2}).withMessage('The category field must be a 2 character')
        .isIn(Object.keys(SpendingCategoryEnum)).withMessage('The category field has a invalid value'),
    body('description')
        .notEmpty().withMessage('The description field cannot be empty')
        .isString().withMessage('The description field must be a string')
        .isLength({max: 40}).withMessage('The description field exceeds maximum of 40 characters'),
    body('installments')
        .if(body('billType').equals('V'))
        .notEmpty().withMessage('The installments field cannot be empty')
        .isNumeric().withMessage('The installments field must be a number')
        .custom(value => value > 0).withMessage('The installments field must be greater than 0'),
    body('installmentValue')
        .notEmpty().withMessage('The installmentValue field cannot be empty')
        .isNumeric().withMessage('The installmentValue field must be a number')
        .custom(value => value > 0).withMessage('The installmentValue field must be greater than 0'),
    body('paymentDay')
        .notEmpty().withMessage('The paymentDay field cannot be empty')
        .isNumeric().withMessage('The paymentDay field must be a number')
        .custom(value => (value > 0 && value <= 31)).withMessage('The paymentDay field must be in range 1-31'),
    body('firstDatePayment')
        .notEmpty().withMessage('The field firstMonthPayment cannot be empty')
        .isString().withMessage('The field firstMonthPayment must be a string')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The firstDatePayment field must be in format yyyy-mm-dd')
        .custom(value => new Date(value) > new Date()).withMessage('The field firstMonthPayment must have a date greater than or equal to the current date')
]

export const payInstallmentValidators = [
    body('installmentKey')
        .notEmpty().withMessage('The installmentKey field cannot be empty')
        .isNumeric().withMessage('The installmentKey field must be a number'),
    body('balanceType')
        .notEmpty().withMessage('The balanceType field cannot be empty')
        .isString().withMessage('The balanceType field must be a string')
        .isLength({min: 2, max: 2}).withMessage('The balanceType field must be a 2 characters')
        .isIn(Object.keys(BalanceTypeEnum)).withMessage('The balanceType field has a invalid value'),
    body('paidValue')
        .notEmpty().withMessage('The paidValue field cannot be empty')
        .isNumeric().withMessage('The paidValue field must be a number')
        .custom(value => value > 0).withMessage('The paidValue must be greater than 0')
]



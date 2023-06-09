import {body} from 'express-validator'

export const spendingCreateValidators = [
    body('description'
        ).notEmpty().withMessage('The description field cannot be empty')
        .isString().withMessage('The description field must be a string')
        .isLength({max: 40}).withMessage('The description field exceeds max 40 characters'),
    body('value')
        .notEmpty().withMessage('The value field cannot be empty')
        .isNumeric().withMessage('The value field must be a number')
        .custom(value => value > 0).withMessage('The value field must have a value greater than zero'),
    body('categoryKey')
        .notEmpty().withMessage('The categoryKey field cannot be empty')
        .isString().withMessage('The categoryKey field must be a string')
        .isLength({min: 2, max: 2}).withMessage('The categoryKey field must have 2 characters'),
    body('balanceType')
        .notEmpty().withMessage('The balanceType field cannot be empty')
        .isString().withMessage('The balanceType field must be a string')
        .isLength({min: 2, max: 2}).withMessage('The balanceType field must have 2 characters'),
]

export const spendingGetValidators = [
    body('startDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The startDate field must be in format yyyy-mm-dd'),
    body('finishDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The finishDate field must be in format yyyy-mm-dd')
]

export const earningCreateValidators = [
    body('description')
        .notEmpty().withMessage('The description field cannot be empty')
        .isString().withMessage('The description field must be a string')
        .isLength({max: 40}).withMessage('The description field exceeds max 40 characters'),
    body('value')
        .notEmpty().withMessage('The value field cannot be empty')
        .isNumeric().withMessage('The value field must be a number')
        .custom(value => value > 0).withMessage('The value field must have a value greater than zero'),
    body('categoryKey')
        .notEmpty().withMessage('The categoryKey field cannot be empty')
        .isString().withMessage('The categoryKey field must be a string')
        .isLength({min: 2, max: 2}).withMessage('The categoryKey field must have 2 characters')
]

export const earningGetValidators = [
    body('startDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The startDate field must be in format yyyy-mm-dd'),
    body('finishDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The finishDate field must be in format yyyy-mm-dd')
]
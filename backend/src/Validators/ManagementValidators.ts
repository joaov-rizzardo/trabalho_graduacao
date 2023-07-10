import {body} from 'express-validator'

export const earningsByCategoryValidators = [
    body('startDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The startDate field must be in format yyyy-mm-dd'),
    body('finishDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The finishDate field must be in format yyyy-mm-dd')
]

export const spendingsByCategoryValidators = [
    body('startDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The startDate field must be in format yyyy-mm-dd'),
    body('finishDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('The finishDate field must be in format yyyy-mm-dd')
]
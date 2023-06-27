import {body} from 'express-validator'

export const createGoalValidators = [
    body('userId')
        .notEmpty().withMessage('The userId field cannot be empty')
        .isNumeric().withMessage('The userId must be a number'),
    body('description')
        .notEmpty().withMessage('The description field cannot be empty')
        .isString().withMessage('The description field must be a string')
        .isLength({max: 40}).withMessage('Max of 40 characters exceeds description field'),
    body('value')
        .notEmpty().withMessage('The value field cannot be empty')
        .isNumeric().withMessage('The value field must be a number')
        .custom(value => value > 0).withMessage('The value field must have a value greater than zero')
]

export const investGoalValidators = [
    body('goalId')
        .notEmpty().withMessage('The goalId field cannot be empty')
        .isNumeric().withMessage('The goalId must be a number'),
    body('value')
        .notEmpty().withMessage('The value field cannot be empty')
        .isNumeric().withMessage('The value field must be a number')
        .custom(value => value > 0).withMessage('The value field must have a value greater than zero')
]
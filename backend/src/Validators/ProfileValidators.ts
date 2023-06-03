import {body} from 'express-validator'

export const updateProfileValidators = [
    body('name').notEmpty().withMessage('The name field cannot be empty'),
    body('name').isString().withMessage('The name field must be a string'),
    body('lastName').notEmpty().withMessage('The lastName field cannot be empty'),
    body('lastName').isString().withMessage('The lastName field must be a string'),
    body('selectedAvatar').notEmpty().withMessage('The avatar field cannot be empty'),
    body('selectedAvatar').isNumeric().withMessage('The avatar field must be a number')
]

export const updatePasswordValidators = [
    body('newPassword').notEmpty().withMessage('The currentPassword field cannot be empty'),
    body('newPassword').isString().withMessage('The currentPassword field must be a string'),
    body('validationCode').notEmpty().withMessage('The validationCode field cannot be empty'),
    body('validationCode').isString().withMessage('The validationCode must be a string')
]

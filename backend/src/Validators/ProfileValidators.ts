import {body} from 'express-validator'

export const updateProfileValidators = [
    body('name').notEmpty().isString().withMessage('The name field cannot be empty'),
    body('lastName').notEmpty().isString().withMessage('The lastName field cannot be empty'),
    body('selectedAvatar').notEmpty().isNumeric().withMessage('The email field must be of email type')
]

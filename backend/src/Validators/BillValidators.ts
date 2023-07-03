import {body} from 'express-validator'

export const signUpValidators = [
    body('username').notEmpty().isString().withMessage('The username field cannot be empty'),
    body('username').isLength({min: 8}).withMessage('The username field must be 8 characters'),
    body('password').notEmpty().isString().withMessage('The password field cannot be empty'),
    body('password').isLength({min: 8}).withMessage('The password field must be 8 characters'),
    body('name').notEmpty().isString().withMessage('The name field cannot be empty'),
    body('lastName').notEmpty().isString().withMessage('The lastName field cannot be empty'),
    body('email').notEmpty().isEmail().withMessage('The email field must be of email type')
]



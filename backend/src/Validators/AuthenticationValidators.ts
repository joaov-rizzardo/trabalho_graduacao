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

export const signInValidators = [
    body('username').notEmpty().isString().withMessage('The username field cannot be empty'),
    body('username').isLength({min: 8}).withMessage('The username field must be 8 characters'),
    body('password').notEmpty().isString().withMessage('The password field cannot be empty'),
    body('password').isLength({min: 8}).withMessage('The password field must be 8 characters'),
]

export const checkTokenValidators = [
    body('token').notEmpty().withMessage("The token field cannot be empty")
]

export const checkVerificationCodeValidators = [
    body('code')
        .isLength({min: 5, max: 5}).withMessage("The userField must be 5 characters")
        .isString().withMessage("The code field must be of numeric type")
]

export const checkPasswordValidators = [
    body('password')
        .notEmpty().withMessage('The password field cannot be empty')
        .isString().withMessage('The password field must be a string type')
]

export const checkEmailValidators = [
    body('email').notEmpty().isEmail().withMessage('The email field must be of email type')
]

export const checkUserValidators = [
    body('username').notEmpty().isString().withMessage('The username field cannot be empty'),
    body('username').isLength({min: 8}).withMessage('The username field must be 8 characters'),
]


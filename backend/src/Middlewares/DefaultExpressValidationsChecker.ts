import {Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'
import { default400Response } from '../Utils/DefaultResponses'

export default function checkExpressValidations(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)
    console.log()
    if(!errors.isEmpty()){
        return res.status(400).send(default400Response(errors.array().map(error => error.msg)))
    }else{
        next()
    }
}

import { Request, Response } from "express";
import { ProfileLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import { BalanceTypeEnum } from "../Enums/BalanceTypeEnum";

export default function getBalanceTypesFlow(req: Request, res: Response){
    try {
        const balanceTypes = getBalanceTypesObject()
        return res.status(200).send(balanceTypes)
    }catch(error: any){
        generateErrorLogFromRequest(ProfileLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export function getBalanceTypesObject(){
    const balanceTypesArray = Object.entries(BalanceTypeEnum)
    const balanceTypesObject = balanceTypesArray.map(type => {
        return {
            key: type[0],
            description: type[1]
        }
    })
    return balanceTypesObject
}
import { Request, Response } from "express";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import { BillEnum } from "../Enums/BillEnum";

export default function getBillTypesFlow(req: Request, res: Response){
    try {
        const billTypes = getBillTypesObject()
        return res.status(200).send(billTypes)
    }catch(error: any){
        generateErrorLogFromRequest(BillLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export function getBillTypesObject(){
    const billTypesArray = Object.entries(BillEnum)
    const billTypesObject = billTypesArray.map(type => {
        return {
            key: type[0],
            description: type[1]
        }
    })
    return billTypesObject
}
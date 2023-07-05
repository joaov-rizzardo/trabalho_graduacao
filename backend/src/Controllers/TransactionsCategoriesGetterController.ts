import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { TransactionLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";

export function getEarningCategoriesFlow(req: Request, res: Response){
    try {
        const earningCategories = getEarningCategoriesObject()
        return res.status(200).send(earningCategories)
    }catch(error: any){
        generateErrorLogFromRequest(TransactionLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export function getSpendingCategoriesFlow(req: Request, res: Response){
    try {
        const spendingCategories = getSpedingCategoriesObject()
        return res.status(200).send(spendingCategories)
    }catch(error: any){
        generateErrorLogFromRequest(TransactionLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export function getEarningCategoriesObject(){
    const earningCategoriesArray = Object.entries(EarningCategoryEnum)
    const earningCategoriesObject = earningCategoriesArray.map(category => {
        return {
            key: category[0],
            description: category[1]
        }
    })
    return earningCategoriesObject
}

export function getSpedingCategoriesObject(){
    const spendingCategoriesArray = Object.entries(SpendingCategoryEnum)
    const spendingCategoriesObject = spendingCategoriesArray.map(category => {
        return {
            key: category[0],
            description: category[1]
        }
    })
    return spendingCategoriesObject
}
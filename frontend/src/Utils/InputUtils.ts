import { moneyMask } from "./Mask";

export function textToMoneyNumber(text: string){
    const moneyFormat = moneyMask(text)
    return moneyFormat !== "" ? parseFloat(moneyFormat) : 0
}
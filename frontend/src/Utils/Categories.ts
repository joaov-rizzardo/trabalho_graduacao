import { EarningCategoryEnum, SpendingCategoryEnum } from "../types/CategoryTypes";

const enumKeys = <T extends Record<string, string>>(e: T) => Object.keys(e) as Array<keyof T>

export function getSpendingCategoriesList(): Array<{
    value: keyof typeof SpendingCategoryEnum,
    label: SpendingCategoryEnum
}> {
    const keys = enumKeys(SpendingCategoryEnum)
    const categories = keys.map(key => ({
        value: key,
        label: SpendingCategoryEnum[key]
    }))
    return categories
}

export function getEarningCategoriesList(): Array<{
    value: keyof typeof EarningCategoryEnum,
    label: EarningCategoryEnum
}> {
    const keys = enumKeys(EarningCategoryEnum)
    const categories = keys.map(key => ({
        value: key,
        label: EarningCategoryEnum[key]
    }))
    return categories
}
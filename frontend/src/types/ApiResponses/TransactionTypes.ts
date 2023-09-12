import { EarningCategoryEnum } from './../../../../backend/src/Enums/EarningCategoryEnum';
import { SpendingCategoryEnum } from './../CategoryTypes';

export type GetSpendings = {
    spendingId: number,
    categoryKey: keyof typeof SpendingCategoryEnum,
    categoryDescription: SpendingCategoryEnum
    spentAt: string,
    userId: number,
    description: string,
    value: number,
    isCanceled: boolean,
    canceledAt?: string
}


export type GetEarnings = {
    earningId: number,
    categoryKey: keyof typeof EarningCategoryEnum,
    categoryDescription: EarningCategoryEnum,
    earnedAt: string,
    userId: number,
    description: string,
    value: number,
    isCanceled: boolean,
    canceledAt?: string
}

export type GetLastActivities = {
    activityId: number,
    userId: number,
    description: string,
    createdAt: string
}

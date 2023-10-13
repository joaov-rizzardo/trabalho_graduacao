import { EarningCategoryEnum, SpendingCategoryEnum } from "../CategoryTypes"

export interface PointRankingMemberType {
    userId: number,
    username: string,
    selectedAvatar: number,
    points: number
}

export interface LevelRankingMemberType {
    userId: number,
    username: string,
    selectedAvatar: number,
    currentLevel: number
}

export type GetPointsRanking = {
    topRanking: {
        division: number,
        ranking: [PointRankingMemberType]
    },
    userRanking: {
        division: number,
        ranking: [PointRankingMemberType]
    }
}

export type GetLevelRanking = {
    topRanking: {
        division: number,
        ranking: [LevelRankingMemberType]
    },
    userRanking: {
        division: number,
        ranking: [LevelRankingMemberType]
    }
}

export type GetEarningByCategoryType = {
    value: number,
    categoryKey: keyof typeof EarningCategoryEnum,
    categoryDescription: EarningCategoryEnum
}

export type GetSpendingByCategoryType = {
    value: number,
    categoryKey: keyof typeof SpendingCategoryEnum,
    categoryDescription: SpendingCategoryEnum
}

export type GetTransactionsType = {
    earnings: [{
        value: number,
        category: keyof typeof EarningCategoryEnum,
        date: string
    }],
    spendings: [{
        value: number,
        category: keyof typeof SpendingCategoryEnum,
        spendingDate: string
    }]
}
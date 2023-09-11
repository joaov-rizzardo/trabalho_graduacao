export type GetUserFinanceType = {
    userId: number,
    balance: number,
    totalSavings: number,
    currentSavings: number
}

export type GetUserLevelType = {
    userId: number,
    currentLevel: number,
    currentXp: number,
    points: number,
    xpToNextLevel: number
}
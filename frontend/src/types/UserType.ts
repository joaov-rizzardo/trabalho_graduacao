export type UserType = {
    userId: number,
    username: string,
    email: string,
    name: string,
    lastName: string,
    selectedAvatar: number,
    isValidatedEmail: boolean,
    createdAt: string
}

export type UserLevel = {
    userId: number,
    currentLevel: number,
    currentXp: number,
    points: number,
    xpToNextLevel: number 
}

export type UserFinance = {
    userId: number,
    balance: number,
    totalSavings: number,
    currentSavings: number
}
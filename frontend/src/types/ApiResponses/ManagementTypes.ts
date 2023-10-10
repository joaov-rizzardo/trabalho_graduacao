export type PointRankingMemberType = {
    userId: number,
    username: string,
    selectedAvatar: number,
    points: number
}

export type LevelRankingMemberType = {
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
import { FieldPacket } from "mysql2/promise"
import { query } from "../Services/Database"

type LevelRankingType = {
    userId: number,
    username: string,
    selectedAvatar: number,
    level: number
}

type PointsRankingType = {
    userId: number,
    username: string,
    selectedAvatar: number,
    points: number
}

export default class RankingDAO {
    
    public async getLevelRankingInfo(){
        const response = await query(`SELECT * FROM vw_level_ranking`) as [LevelRankingType[], FieldPacket[]]
        const rankingInfo = response[0]
        return rankingInfo
    }

    public async getPointsRankingInfo(){
        const response = await query(`SELECT * FROM vw_points_ranking`) as [PointsRankingType[], FieldPacket[]]
        const rankingInfo = response[0]
        return rankingInfo
    }
}
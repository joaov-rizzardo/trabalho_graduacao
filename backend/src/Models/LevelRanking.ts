import RankingDAO from "../DAO/RankingsDAO"
import Ranking from "./Ranking"

type LevelRankingType = {
    userId: number
    username: string
    selectedAvatar: number
    level: number
}

export default class LevelRanking extends Ranking {
    private ranking: LevelRankingType[]
    private partitionedRanking: Array<LevelRankingType[]>

    constructor(ranking: LevelRankingType[]){
        super()
        this.ranking = ranking
        this.partitionedRanking = this.partitionateRanking(ranking)
    }

    public getTopRanking(){
        return this.partitionedRanking[0]
    }

    public getUserRanking(userId: number){
        const userRanking = this.partitionedRanking.find(ranking => {
            const findUser = ranking.find(user => user.userId === userId)
            return findUser !== undefined
        })
        if(userRanking === undefined){
            throw new Error('Não foi possível encontrar o ranking para o usuário informado')
        }
        return userRanking
    }

    public static async getInstanceWithRankings(){
        const rankingDAO = new RankingDAO()
        const rankingData = await rankingDAO.getLevelRankingInfo()
        return new this(rankingData)
    }
}
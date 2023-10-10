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
        return {
            division: 1,
            ranking: this.partitionedRanking[0]   
        }
    }

    public getUserRanking(userId: number){
        const userRankingIndex = this.partitionedRanking.findIndex(ranking => {
            const findUser = ranking.find(user => user.userId === userId)
            return findUser !== undefined
        })
        if(userRankingIndex === -1){
            throw new Error('Não foi possível encontrar o ranking para o usuário informado')
        }
        return {
            division: userRankingIndex + 1,
            ranking: this.partitionedRanking[userRankingIndex]
        }
    }

    public static async getInstanceWithRankings(){
        const rankingDAO = new RankingDAO()
        const rankingData = await rankingDAO.getLevelRankingInfo()
        return new this(rankingData)
    }
}
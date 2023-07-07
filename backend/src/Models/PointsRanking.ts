import RankingDAO from "../DAO/RankingsDAO"
import Ranking from "./Ranking"

type PointsRankingType = {
    userId: number
    username: string
    selectedAvatar: number
    points: number
}

export default class PointsRanking extends Ranking{
    private ranking: PointsRankingType[]
    private partitionedRanking: Array<PointsRankingType[]>

    constructor(ranking: PointsRankingType[]){
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
        const rankingData = await rankingDAO.getPointsRankingInfo()
        return new this(rankingData)
    }
}
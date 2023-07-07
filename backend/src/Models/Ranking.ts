import RankingDAO from "../DAO/RankingsDAO"

export default class Ranking {

    protected rankingDAO: RankingDAO

    constructor(){
        this.rankingDAO = new RankingDAO()
    }
    
    protected partitionateRanking(ranking: any[]){
        const partitionLength = 20
        const partionedArray = []
        for(let i = 0; i < ranking.length; i += partitionLength){
            partionedArray.push(ranking.slice(i, i + partitionLength))
        }
        return partionedArray
    }
}
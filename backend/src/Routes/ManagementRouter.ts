import {Router, Request, Response} from 'express'
import tokenAuthenticationMiddleware from '../Middlewares/TokenAuthenticationMiddleware'
import { getLevelRankingFlow, getPointsRankingFlow } from '../Controllers/RankingsController'

const managementRouter = Router()

managementRouter.use(tokenAuthenticationMiddleware)

managementRouter.all('/', (req: Request, res: Response) => {
    res.status(200).send('Management service is running')
})

managementRouter.get('/pointsRanking', getPointsRankingFlow)
managementRouter.get('/levelRanking', getLevelRankingFlow)

export default managementRouter
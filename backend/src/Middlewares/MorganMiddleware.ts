import morgan, {StreamOptions} from "morgan"
import { HTTPLogger } from "../Utils/Logger"

const stream: StreamOptions = {
    write: message => HTTPLogger.info(message)
}

const skip = () => {
    return process.env.DEBUGMODE !== 'TRUE'
}

const morganMiddleware  = morgan(
    "Method: :method URL: :url Status-Code: :status Reponse-Size: :res[content-length] Response-Time: :response-time ms",
    {stream, skip}
)

export default morganMiddleware
import handleSearchForNewAvatars from "../Flows/AvatarApiGetterFlow"
import sweepAvatarDirectory from "../Flows/AvatarDirectorySweepFlow"
import { Args } from "../Utils/ArgsParser"

type ScriptsMapperType = {
    [key: string]: (args: Args) => void
}

const ScriptsMapper: ScriptsMapperType = {
    AvatarApiGetter: handleSearchForNewAvatars,
    AvatarDirectorySweep: sweepAvatarDirectory
}

export default ScriptsMapper
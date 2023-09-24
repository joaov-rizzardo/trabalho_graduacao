import { useState } from "react";
import { UserLevel } from "../types/UserType";
import { GetUserLevelType } from "../types/ApiResponses/ProfileTypes";
import { backendApi } from "../configs/Api";

export type UpdateLevelType = {
    currentLevel?: number,
    currentXp?: number,
    points?: number,
    xpToNextLevel?: number
}

export default function useLevel(){
    const [level, setLevel] = useState<UserLevel>({} as UserLevel)

    const findUserLevel = async () => {
        try {
            const {data: userLevelData} = await backendApi.get<GetUserLevelType>('/profile/userLevel')
            setLevel({
                userId: userLevelData.userId,
                currentLevel: userLevelData.currentLevel,
                currentXp: userLevelData.currentXp,
                points: userLevelData.points,
                xpToNextLevel: userLevelData.xpToNextLevel
            })
        }catch(error: any){
            console.log(error)
        }
    }

    const updateLevel = ({currentLevel, currentXp, points, xpToNextLevel}: UpdateLevelType) => {
        setLevel(prevLevel => ({
            ...prevLevel,
            currentLevel: currentLevel || prevLevel.currentLevel,
            currentXp: currentXp || prevLevel.currentXp,
            points: points || prevLevel.points,
            xpToNextLevel: xpToNextLevel || prevLevel.xpToNextLevel
        }))
    }

    return {level, findUserLevel, updateLevel}
}
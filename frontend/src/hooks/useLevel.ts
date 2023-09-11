import { useContext, useEffect, useState } from "react";
import { UserLevel } from "../types/UserType";
import { AuthContext } from "../contexts/AuthContext";
import { GetUserLevelType } from "../types/ApiResponses/ProfileTypes";
import { backendApi } from "../configs/Api";

export default function useLevel(){
    const [level, setLevel] = useState<UserLevel>({} as UserLevel)
    const {token} = useContext(AuthContext)

    useEffect(() => {
        if(token !== ""){
            findUserLevel()
        }
    }, [token, backendApi])

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

    return {level}
}
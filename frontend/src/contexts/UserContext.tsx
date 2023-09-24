import React, { ReactNode, createContext } from "react";
import useUser from "../hooks/useUser";
import { UserFinance, UserLevel } from "../types/UserType";
import { UpdateLevelType } from "../hooks/useLevel";
import { UpdateFinancesType } from "../hooks/useFinance";

type UserContextType = {
    finances: UserFinance,
    updateLevel: ({ currentLevel, currentXp, points, xpToNextLevel }: UpdateLevelType) => void,
    updateFinances: ({ balance, currentSavings, totalSavings }: UpdateFinancesType) => void,
    level: UserLevel
}

const UserContext = createContext<UserContextType>({} as UserContextType)

function UserProvider({ children }: { children: ReactNode }) {
    const { finances, level, updateLevel, updateFinances} = useUser()
    return (
        <UserContext.Provider value={{ finances, level, updateLevel, updateFinances }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
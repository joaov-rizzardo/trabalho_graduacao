import React, { ReactNode, createContext } from "react";
import useUser from "../hooks/useUser";
import { UserFinance, UserLevel } from "../types/UserType";

type UserContextType = {
    finances: {
        finances: UserFinance
    },
    level: {
        level: UserLevel
    }
}

const UserContext = createContext<UserContextType>({} as UserContextType)

function UserProvider({children}: {children: ReactNode}){
    const {finances, level} = useUser()
    return (
        <UserContext.Provider value={{finances, level}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext, UserProvider}
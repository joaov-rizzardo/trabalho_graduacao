import { ReactNode, createContext } from "react";
import { UserType } from "../types/UserType";
import useAuth, { LoginFunctionType } from "../hooks/useAuth";

type AuthContextType = {
    login: ({ username, password }: {
        username: string;
        password: string;
    }) => Promise<LoginFunctionType>, 
    logout: () => Promise<boolean>, 
    loginWithToken: () => Promise<UserType | false>, 
    user: UserType, 
    token: string, 
    authenticated: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

function AuthProvider({children}: {children: ReactNode}){
    const {login, logout, loginWithToken, user, token, authenticated} = useAuth()
    return (
        <AuthContext.Provider value={{login, logout, loginWithToken, user, token, authenticated}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}
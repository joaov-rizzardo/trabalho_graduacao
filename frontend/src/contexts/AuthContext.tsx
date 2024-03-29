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
    validateEmail: (code: string) => Promise<{
        ok: boolean;
        message: string;
    }>,
    user: UserType, 
    token: string, 
    authenticated: boolean,
    changeUserProfile: ({name, lastName, avatarId}: {name: string, lastName: string, avatarId: number}) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

function AuthProvider({children}: {children: ReactNode}){
    const {login, logout, loginWithToken, user, token, authenticated, validateEmail, changeUserProfile} = useAuth()
    return (
        <AuthContext.Provider value={{login, logout, loginWithToken, validateEmail, user, token, authenticated, changeUserProfile}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}
import { useState } from "react"
import { UserType } from "../types/UserType"
import { backendApi } from "../configs/Api"
import { SignInType } from "../types/ApiResponses/Authentication/SignInType"
import useStorage from "./useStorage"
import { CheckTokenType } from "../types/ApiResponses/Authentication/CheckTokenType"

export default function useAuth(){
    const [user, setUser] = useState<UserType>({} as UserType)
    const [token, setToken] = useState<string>('')
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const {setStorageItem, removeStorageItem, getStorageItem} = useStorage()

    const login = async ({username, password}: {username: string, password: string}) => {
        try{
            const response = await backendApi.post<SignInType>('/authentication/signin', {
                username, password
            })
            const {token, user} = response.data
            if(!await storageToken(token)){
                throw new Error('Unable to store token')
            }
            setUser(user)
            setAuthenticated(true)
            return true
        }catch(error: any){
            return false
        }
    }

    const logout = async () => {
        setUser({} as UserType)
        setToken('')
        setAuthenticated(false)
        return await removeStorageItem('token')
    }

    const loginWithToken = async() => {
        try{
            const token = await getStorageItem('token')
            if(token === false){
                throw new Error('No token was saved in storage')
            }
            const response = await backendApi.post<CheckTokenType>('/authentication/checkToken', {
                token
            })
            const {isValid, user} = response.data
            if(isValid && user !== undefined){
                setUser(user)
                setAuthenticated(true)
                return true
            }else{
                return false
            }
        }catch(error: any){
            return false
        }
    }

    async function storageToken(token: string){
        setToken(token)
        return await setStorageItem('token', token)
    }
    
    return {login, logout, loginWithToken, user, token, authenticated}
}
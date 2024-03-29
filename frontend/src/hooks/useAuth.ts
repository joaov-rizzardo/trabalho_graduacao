import { useEffect, useState } from "react"
import { UserType } from "../types/UserType"
import { backendApi } from "../configs/Api"
import useStorage from "./useStorage"
import axios, { AxiosError, AxiosInstance } from "axios"
import { CheckTokenType, SignInType, checkVerificationCode } from "../types/ApiResponses/AuthenticationTypes"

export type LoginFunctionType = {
    ok: boolean,
    message: string
}

export default function useAuth(){
    const [user, setUser] = useState<UserType>({} as UserType)
    const [token, setToken] = useState<string>('')
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const {setStorageItem, removeStorageItem, getStorageItem} = useStorage()

    useEffect(() => {
        backendApi.defaults.headers.common['Authorization'] = token !== "" ? `Bearer ${token}` : ''
    }, [token])

    const login = async ({username, password}: {username: string, password: string}): Promise<LoginFunctionType> => {
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
            return {
                ok: true,
                message: ''
            }
        }catch(error: any){
            if(axios.isAxiosError(error)){
                const axiosError = error as AxiosError
                if(axiosError.response?.status === 400){
                    return {
                        ok: false,
                        message: 'Usuário e/ou senha incorretos. Confira suas credenciais de acesso.'
                    }
                }
            }
            return {
                ok: false,
                message: 'Não foi possível realizar o login, tente novamente mais tarde.'
            }
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
            const storagedToken = await getStorageItem('token')
            if(storagedToken === false){
                throw new Error('No token was saved in storage')
            }
            const response = await backendApi.post<CheckTokenType>('/authentication/checkToken', {
                token: storagedToken
            })
            const {isValid, user} = response.data
            if(isValid && user !== undefined){
                setToken(storagedToken)
                setUser(user)
                setAuthenticated(true)
                return user
            }else{
                return false
            }
        }catch(error: any){
            return false
        }
    }

    const validateEmail = async (code: string) => {
        try {
            const {data: {checked}} = await backendApi.post<checkVerificationCode>(`/authentication/checkVerificationCode/${user.userId}`, {
                code: code
            })
            if(checked === false){
                return {ok: false, message: 'O token informado está inválido'}
            }
            setUser(currentUser => ({
                ...currentUser,
                isValidatedEmail: true
            }))
            return {ok: true, message: ''}
        }catch(error){
            return {ok: false, message: 'Não foi possível se comunicar com o servidor, tente novamente mais tarde'}
        }
    }

    const changeUserProfile = ({name, lastName, avatarId}: {name: string, lastName: string, avatarId: number}) => {
        setUser(prevUser => ({
            ...prevUser,
            name, lastName, selectedAvatar: avatarId
        }))
    }

    async function storageToken(token: string){
        setToken(token)
        return await setStorageItem('token', token)
    }
    
    return {login, logout, loginWithToken, user, token, authenticated, validateEmail, changeUserProfile}
}
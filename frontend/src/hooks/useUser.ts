import {useContext, useEffect } from "react";
import useFinance from "./useFinance";
import useLevel from "./useLevel";
import { AuthContext } from "../contexts/AuthContext";
import { backendApi } from "../configs/Api";

export default function useUser(){
    const {finances, findUserFinances, updateFinances} = useFinance()
    const {level, findUserLevel, updateLevel} = useLevel()
    const {token} = useContext(AuthContext)
    
    useEffect(() => {
        if(backendApi.defaults.headers.common['Authorization'] !== ""){
            Promise.all([
                findUserFinances(),
                findUserLevel()
            ])
        }
    }, [token])

    return {
        finances,
        updateFinances,
        updateLevel,
        level
    }
}
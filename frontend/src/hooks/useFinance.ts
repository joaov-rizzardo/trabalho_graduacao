import { useState } from 'react';
import { UserFinance } from '../types/UserType';
import { GetUserFinanceType } from '../types/ApiResponses/ProfileTypes';
import { backendApi } from '../configs/Api';


export type UpdateFinancesType = {
    balance?: number,
    totalSavings?: number,
    currentSavings?: number
}

export default function useFinance(){
    const [finances, setFinances] = useState<UserFinance>({} as UserFinance)

    const findUserFinances = async () => {
        try {
            const {data: userFinanceData} = await backendApi.get<GetUserFinanceType>('/profile/userFinance')
            setFinances({
                userId: userFinanceData.userId,
                balance: userFinanceData.balance,
                totalSavings: userFinanceData.totalSavings,
                currentSavings: userFinanceData.currentSavings
            })
        }catch(error: any){
            console.log(error)
        }
    }

    const updateFinances = ({balance, currentSavings, totalSavings}: UpdateFinancesType) => {
        setFinances(prevFinance => ({
            ...prevFinance,
            balance: balance || prevFinance.balance,
            currentSavings: currentSavings || prevFinance.currentSavings,
            totalSavings: totalSavings || prevFinance.totalSavings
        }))
    }

    return {finances, findUserFinances, updateFinances}
}
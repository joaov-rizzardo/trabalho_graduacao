import { useContext, useEffect, useState } from 'react';
import { UserFinance } from '../types/UserType';
import { AuthContext } from '../contexts/AuthContext';
import { GetUserFinanceType } from '../types/ApiResponses/ProfileTypes';
import { backendApi } from '../configs/Api';
export default function useFinance(){
    const [finances, setFinances] = useState<UserFinance>({} as UserFinance)
    const {token} = useContext(AuthContext)

    useEffect(() => {
        if(token !== ""){
            findUserFinances()
        }
    }, [token, backendApi])

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

    return {finances}
}
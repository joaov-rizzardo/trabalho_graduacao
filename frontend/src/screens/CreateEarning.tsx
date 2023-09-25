import { ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import EarningCategorySelector from "../components/EarningCategorySelector";
import CustomButton from "../components/CustomButton";
import { useContext, useState } from "react";
import { EarningCategoryEnum } from "../types/CategoryTypes";
import { moneyMask } from "../Utils/Mask";
import { PopupContext } from "../contexts/PopupContext";
import { backendApi } from "../configs/Api";
import { CreateEarningType } from "../types/ApiResponses/TransactionTypes";
import { UserContext } from "../contexts/UserContext";

export default function CreateEarning() {
    const {openAlertPopup, openModalRewards, openModalLevelup} = useContext(PopupContext)
    const {level, updateFinances, updateLevel} = useContext(UserContext)
    const [category, setCategory] = useState<keyof typeof EarningCategoryEnum | ''>('')
    const [description, setDescription] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [isCreating, setIsCreating] = useState<boolean>(false)

    async function handleCreateEarning(){
        try{
            const {ok, message} = handleValidations()
            if(ok === false){
                return openAlertPopup({
                    title: 'Atenção',
                    content: message
                })
            }
            const {data: {rewards, userFinance, userLevel}} = await backendApi.post<CreateEarningType>('/transaction/earning/create', {
                description: description.trim(),
                value: parseFloat(value),
                categoryKey: category
            })
            const levelUp = userLevel.currentLevel > level.currentLevel
            updateFinances({
                balance: userFinance.balance,
                currentSavings: userFinance.currentSavings,
                totalSavings: userFinance.currentSavings
            })
            updateLevel({
                currentLevel: userLevel.currentLevel,
                currentXp: userLevel.currentXp,
                points: userLevel.points,
                xpToNextLevel: userLevel.xpToNextLevel
            })
            clearData()
            openModalRewards({
                points: rewards.points,
                xp: rewards.xp,
                close: () => {
                    if(levelUp){
                        openModalLevelup({
                            level: userLevel.currentLevel,
                            avatarRewards: userLevel.earnedAvatars.map(avatar => avatar.avatarId)
                        })
                    }
                }
            })
        }catch(error: any){
            console.log(error)
            return openAlertPopup({
                title: 'Atenção',
                content: 'Não foi possível realizar o lançamento, tente novamente mais tarde.'
            }) 
        }
    }

    function handleValidations(){
        const floatValue = parseFloat(value)
        if(floatValue <= 0){
            return {ok: false, message: 'O valor de lançamento precisa ser superior a zero'}
        }
        if(description.trim() === ""){
            return {ok: false, message: 'Por favor, informe uma descrição para o lançamento que está registrando'}
        }
        if(category === ""){
            return {ok: false, message: 'Por favor, selecione uma categoria para realizar o lançamento'}
        }
        return {ok: true, message: ''}
    }

    function clearData(){
        setValue('')
        setCategory('')
        setDescription('')
    }

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="description" />
                    <CustomInput.Input placeholder="Descrição" value={description} onChangeText={text => setDescription(text)}/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input 
                        placeholder="Valor" 
                        keyboardType="number-pad" 
                        value={value}
                        onChangeText={text => setValue(moneyMask(text))}
                    />
                </CustomInput.Container>
                <EarningCategorySelector category={category} setCategory={setCategory} />
                <CustomButton text="Realizar lançamento" onPress={async () => {
                    setIsCreating(true)
                    await handleCreateEarning()
                    setIsCreating(false)
                }} loading={isCreating}/>
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 28
    }
})
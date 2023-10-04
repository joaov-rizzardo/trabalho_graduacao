import { ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { moneyMask } from "../Utils/Mask";
import { useContext, useState } from "react";
import { backendApi } from "../configs/Api";
import { PopupContext } from "../contexts/PopupContext";
import { CreateGoalResponse } from "../types/ApiResponses/GoalTypes";

export default function CreateGoals() {
    const [description, setDescription] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const { openAlertPopup } = useContext(PopupContext)

    async function createGoal() {
        try {
            const { ok, message } = handleValidations()
            if (ok === false) {
                return openAlertPopup({
                    title: 'Atenção',
                    content: message
                })
            }
            await backendApi.post<CreateGoalResponse>('/goal/create', {
                description,
                value: parseFloat(value)
            })
            clearData()
            return openAlertPopup({
                title: 'Sucesso',
                content: 'A meta foi registrada com êxito.'
            })
        } catch (error: any) {
            console.log(error)
            return openAlertPopup({
                title: 'Atenção',
                content: 'Não foi possível criar a meta, tente novamente mais tarde'
            })
        }
    }

    function clearData() {
        setDescription('')
        setValue('')
    }

    function handleValidations() {
        const goalValue = value !== "" ? parseFloat(value) : 0
        if (description.trim() === "") {
            return { ok: false, message: 'Por favor, informe uma descrição para a meta.' }
        }
        if (goalValue <= 0) {
            return { ok: false, message: 'O valor deve ser superior a zero.' }
        }
        return { ok: true, message: '' }
    }

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="description" />
                    <CustomInput.Input
                        placeholder="Descrição"
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input
                        placeholder="Valor da meta"
                        value={value}
                        onChangeText={text => setValue(moneyMask(text))}
                    />
                </CustomInput.Container>
                <CustomButton
                    text="Criar meta"
                    loading={isCreating}
                    onPress={async () => {
                        setIsCreating(true)
                        await createGoal()
                        setIsCreating(false)
                    }}
                />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 28
    }
})
import { Modal, StyleSheet, View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { colors } from "../configs/Theme";
import { useContext, useState } from "react";
import { PopupContext } from "../contexts/PopupContext";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import { GetGoalType, RecoverInvestmentsResponse } from "../types/ApiResponses/GoalTypes";
import { moneyMask } from "../Utils/Mask";
import { backendApi } from "../configs/Api";
import { UserContext } from "../contexts/UserContext";
import IconButton from "./IconButton";

interface RecoverInvestmentsProps {
    visible: boolean,
    closeModal: () => void,
    goal: GetGoalType,
    onSave: (goal: GetGoalType) => void
}

async function recoverInvestments(goalId: number, recoverValue: number) {
    try {
        const { data: { goal, userFinance } } = await backendApi.put<RecoverInvestmentsResponse>('/goal/recoverInvestment', {
            goalId,
            value: recoverValue
        })
        return { ok: true, message: '', goal, userFinance }
    } catch (error: any) {
        console.log(error)
        return { ok: false, message: 'Não foi possível recuperar os investimentos, tente novamente mais tarde', goal: null, userFinance: null }
    }
}

export default function RecoverInvestments({ visible, closeModal, goal, onSave }: RecoverInvestmentsProps) {
    const [recoverValue, setRecoverValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const { updateFinances } = useContext(UserContext)
    const { openAlertPopup } = useContext(PopupContext)

    async function handleRecoverInvestments() {
        const validationResponse = handleValidations()
        if (validationResponse.ok === false) {
            return openAlertPopup({
                title: 'Atenção',
                content: validationResponse.message
            })
        }
        const { ok, message, goal: responseGoal, userFinance } = await recoverInvestments(goal.goalId, parseFloat(recoverValue) || 0)
        if (ok === false || goal === null || userFinance === null) {
            return openAlertPopup({
                title: 'Atenção',
                content: message
            })
        }
        setRecoverValue('')
        updateFinances(userFinance)
        closeModal()
        onSave(responseGoal)
    }

    function handleValidations() {
        const floatValue = parseFloat(recoverValue) || 0
        if (floatValue <= 0) {
            return { ok: false, message: 'O valor deve ser superior a zero.' }
        }
        if (floatValue > goal.progressValue) {
            return { ok: false, message: 'Você não possuí esse valor para recuperar.' }
        }
        return { ok: true, message: '' }
    }

    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
        >
            <View style={styles.container} >
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{goal.description}</Text>
                        <IconButton icon="close" color={colors.background} onPress={closeModal}/>
                    </View>
                    <View style={styles.body}>
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Image style={{ width: 36, height: 36 }} source={require('../../assets/images/dinheiro.png')} />
                            <View>
                                <Text style={styles.investValueText}>Valor investido</Text>
                                <Text style={styles.investValue}>{goal.progressValue.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}</Text>
                            </View>
                        </View>
                        <CustomInput.Container>
                            <CustomInput.Icon iconName="attach-money" />
                            <CustomInput.Input placeholder="Valor a recuperar" value={recoverValue} onChangeText={text => setRecoverValue(moneyMask(text))} />
                        </CustomInput.Container>
                        <CustomButton
                            text="Recuperar investimentos"
                            loading={isLoading}
                            onPress={async () => {
                                setIsLoading(true)
                                await handleRecoverInvestments()
                                setIsLoading(false)
                            }} 
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        width: '100%',
        height: 300,
        backgroundColor: colors.sections,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    body: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 28,
        justifyContent: 'space-between',
    },
    titleContainer: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        backgroundColor: colors.mainColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.background
    },
    investValueText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12,
        color: colors.text
    },
    investValue: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.highlight
    },
    button: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mainColor
    },
    buttonText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.background
    }
})
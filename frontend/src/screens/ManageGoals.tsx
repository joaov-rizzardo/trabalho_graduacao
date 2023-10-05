import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import { useContext, useEffect, useState } from "react";
import { backendApi } from "../configs/Api";
import { colors } from "../configs/Theme";
import IconButton from "../components/IconButton";
import { SpendingCategoryImages } from "../types/CategoryTypes";
import { dateDiferenceInDays } from "../Utils/DateUtils";
import { PopupContext } from "../contexts/PopupContext";
import { BillType } from "../types/ApiResponses/BillTypes";
import { GetGoalType } from "../types/ApiResponses/GoalTypes";

async function findGoals() {
    try {
        const { data: goals } = await backendApi.get<GetGoalType[]>('/goal/get')
        return goals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error: any) {
        console.log(error)
        return []
    }
}

export default function ManageGoals() {
    const [search, setSearch] = useState<string>("")
    const [goals, setGoals] = useState<GetGoalType[]>([])
    const { openAlertPopup, openConfirmPopUp } = useContext(PopupContext)

    useEffect(() => {
        findGoals().then(findedGoals => setGoals(findedGoals.filter(goal => goal.isCompleted === false)))
    }, [])

    async function handleCancelGoal(goalId: number) {
        try {
            await backendApi.put(`goal/cancel/${goalId}`)
            setGoals(goals.filter(goal => goal.goalId !== goalId))
            return openAlertPopup({
                title: 'Atenção',
                content: 'A meta foi cancelada com sucesso.'
            })
        } catch (error: any) {
            console.log(error)
            return openAlertPopup({
                title: 'Atenção',
                content: 'Não foi possível cancelar a meta, tente novamente mais tarde.'
            })
        }
    }

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="search" />
                    <CustomInput.Input placeholder="Buscar categoria" value={search} onChangeText={text => setSearch(text)} />
                </CustomInput.Container>
                {goals.flatMap((goal, index) => {
                    if (search !== "" && !goal.description.toLowerCase().includes(search.toLowerCase())) {
                        return false
                    }
                    return (
                        <View style={styles.itemContainer} key={index}>
                            <Image source={require('../../assets/images/alvo.png')} style={styles.itemImage} />
                            <View style={{
                                flex: 1,
                                height: 36,
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                            }}>
                                <Text style={{ ...styles.text, fontSize: 12, color: colors.text }}>{goal.description}</Text>
                                <Text style={{ ...styles.text, fontSize: 16, color: colors.mainColor }}>{goal.value?.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}</Text>
                            </View>
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Text style={{ ...styles.text, fontSize: 16, color: colors.highlight }}>{goal.progressValue?.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}</Text>
                            </View>
                            <IconButton
                                onPress={() => {
                                    openConfirmPopUp({
                                        title: 'Atenção',
                                        content: 'Você tem certeza que deseja cancelar a meta? Essa ação é irreversível',
                                        onConfirm: () => handleCancelGoal(goal.goalId)
                                    })
                                }}
                                style={{ alignSelf: 'flex-end' }}
                                icon="delete" size={28}
                                color={colors.mainColor}
                            />
                        </View>
                    )
                })}
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    itemContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: colors.sections,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12
    },
    itemImage: {
        width: 36,
        height: 36,
        alignSelf: 'center'
    },
    text: {
        fontFamily: 'ComicNeue_400Regular'
    }
})
import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import IconButton from "./IconButton";
import CustomInput from "./CustomInput";
import { SpendingCategoryImages } from "../types/CategoryTypes";
import { useEffect, useState } from "react";
import FullscreenModalTemplate from "./FullscreenModalTemplate";
import { backendApi } from "../configs/Api";
import { GetGoalType } from "../types/ApiResponses/GoalTypes";

interface EarningCategorySelectorProps {
    selectedGoal: GetGoalType | null,
    setGoal: React.Dispatch<React.SetStateAction<null | GetGoalType>>
}

async function findUncompletedGoals(){
    try{
        const {data: goals} = await backendApi.get<GetGoalType[]>('/goal/get')
        return goals.filter(goal => goal.isCompleted === false)
    }catch(error: any){
        console.log(error)
        return []
    }
}

export default function GoalSelector({ selectedGoal, setGoal }: EarningCategorySelectorProps) {
    const [search, setSearch] = useState<string>('')
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [goals, setGoals] = useState<GetGoalType[]>([])
    useEffect(() => {
        const getGoals = async () => {
            const goalsData = await findUncompletedGoals()
            setGoals(goalsData)
        }
        getGoals()
    }, [])
    return (
        <>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setIsOpenModal(true)}>
                <Image style={styles.inputImage} source={require('../../assets/images/alvo.png')} />
                <Text style={styles.inputText}>  {selectedGoal !== null ? selectedGoal.description : 'Selecione uma meta'}</Text>
                <MaterialIcon name="expand-more" size={36} color={colors.mainColor} />
            </TouchableOpacity>
            <FullscreenModalTemplate visible={isOpenModal} transparent={true} animationType="slide">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContainer}>
                    <IconButton icon="close" size={36} color={colors.mainColor} onPress={() => setIsOpenModal(false)} />
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="search" />
                        <CustomInput.Input placeholder="Buscar meta" value={search} onChangeText={text => setSearch(text)} />
                    </CustomInput.Container>
                    {goals.flatMap((goal, index) => {
                        if (search !== "" && !goal.description.toLowerCase().includes(search.toLowerCase())) {
                            return false
                        }
                        return (
                            <TouchableOpacity key={index} onPress={() => {
                                setIsOpenModal(false)
                                setGoal(goal)
                            }} style={styles.itemContainer}>
                                <Image source={require('../../assets/images/alvo.png')} style={styles.itemImage} />
                                <View style={styles.itemTextContainer}>
                                    <Text style={{ ...styles.itemText, ...styles.descriptionText }}>{goal.description}</Text>
                                    <View style={{flexDirection: 'row', gap: 20}}>
                                        <Text style={{ ...styles.itemText, ...styles.goalValue }}>{goal.value.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}</Text>
                                        <Text style={{ ...styles.itemText, ...styles.currentValue }}>{goal.progressValue.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}</Text>
                                    </View>
                                </View>
                                <View style={styles.circle}>
                                    {selectedGoal === goal && (
                                        <View style={styles.selected} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </FullscreenModalTemplate>
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 48,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.sections,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    inputImage: {
        width: 36,
        height: 36
    },
    inputText: {
        flex: 1,
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.text
    },
    modalContainer: {
        padding: 16,
        gap: 16
    },
    itemContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.sections,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        gap: 16
    },
    itemImage: {
        width: 36,
        height: 36
    },
    itemText: {
        fontFamily: 'ComicNeue_400Regular',
        flex: 1,
        textAlign: "left"
    },
    descriptionText: {
        fontSize: 12,
        color: colors.text,
    },
    goalValue: {
        fontSize: 12,
        color: colors.mainColor,
    },
    currentValue: {
        fontSize: 12,
        color: colors.highlight,
    },
    itemTextContainer: {
        flex: 1,
        gap: 16
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: colors.mainColor
    }
})
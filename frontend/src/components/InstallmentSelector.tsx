import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import IconButton from "./IconButton";
import CustomInput from "./CustomInput";
import { SpendingCategoryImages } from "../types/CategoryTypes";
import { useEffect, useState } from "react";
import FullscreenModalTemplate from "./FullscreenModalTemplate";
import { GetInstallmentsType } from "../types/ApiResponses/BillTypes";
import { backendApi } from "../configs/Api";
import { formatDateToBrString } from "../Utils/DateUtils";

interface EarningCategorySelectorProps {
    selectedInstallment: GetInstallmentsType | null,
    setInstallment: React.Dispatch<React.SetStateAction<null | GetInstallmentsType>>
}

async function findInstallmentsToPay() {
    try {
        const { data: installmentData } = await backendApi.post<GetInstallmentsType[]>('/bill/getInstallments', {
            payed: false
        })
        return installmentData
    } catch (error: any) {
        console.log(error)
        return []
    }
}

export default function InstallmentSelector({ selectedInstallment, setInstallment }: EarningCategorySelectorProps) {
    const [search, setSearch] = useState<string>('')
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [installments, setInstallments] = useState<GetInstallmentsType[]>([])
    useEffect(() => {
        const getInstallments = async () => {
            const installmentsData = await findInstallmentsToPay()
            installmentsData.sort((a, b) => (new Date(b.dueDate))?.getDate() - (new Date(a.dueDate)?.getDate()))
            setInstallments(installmentsData)
        }
        getInstallments()
    }, [])
    return (
        <>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setIsOpenModal(true)}>
                <Image style={styles.inputImage} source={require('../../assets/images/conta.png')} />
                <Text style={styles.inputText}>  {selectedInstallment !== null ? `${selectedInstallment.description} ${selectedInstallment.installmentNumber}ª parcela` : 'Selecione uma conta'}</Text>
                <MaterialIcon name="expand-more" size={36} color={colors.mainColor} />
            </TouchableOpacity>
            <FullscreenModalTemplate visible={isOpenModal} transparent={true} animationType="slide">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContainer}>
                    <IconButton icon="close" size={36} color={colors.mainColor} onPress={() => setIsOpenModal(false)} />
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="search" />
                        <CustomInput.Input placeholder="Buscar conta" value={search} onChangeText={text => setSearch(text)} />
                    </CustomInput.Container>
                    {installments.flatMap((installment, index) => {
                        if (search !== "" && !installment.description.toLowerCase().includes(search.toLowerCase())) {
                            return false
                        }
                        return (
                            <TouchableOpacity key={index} onPress={() => {
                                setIsOpenModal(false)
                                setInstallment(installment)
                            }} style={styles.itemContainer}>
                                <Image source={SpendingCategoryImages[installment.categoryKey]} style={styles.itemImage} />
                                <View style={styles.itemTextContainer}>
                                    <Text style={{ ...styles.itemText, ...styles.descriptionText }}>{installment.description}</Text>
                                    <Text style={{ ...styles.itemText, ...styles.categoryText }}>{installment.categoryDescription}</Text>
                                </View>
                                <View>
                                    <Text style={{ ...styles.itemText, ...styles.valueText }}>{installment.value?.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}</Text>
                                    <Text style={{ ...styles.itemText, ...styles.dueDateText }}>{formatDateToBrString(new Date(installment.dueDate))}</Text>
                                </View>
                                <View style={styles.circle}>
                                    {selectedInstallment === installment && (
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
    categoryText: {
        fontSize: 16,
        color: colors.mainColor,
    },
    valueText: {
        fontSize: 16,
        color: colors.highlight,
        textAlign: 'center'
    },
    dueDateText: {
        fontSize: 12,
        color: colors.secondaryHighlight,
        textAlign: 'center'
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
import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import IconButton from "./IconButton";
import CustomInput from "./CustomInput";
import { EarningCategoryEnum, EarningCategoryImages } from "../types/CategoryTypes";
import { useState } from "react";
import { getEarningCategoriesList } from "../Utils/Categories";
import FullscreenModalTemplate from "./FullscreenModalTemplate";

interface EarningCategorySelectorProps {
    category: keyof typeof EarningCategoryEnum | '',
    setCategory:React.Dispatch<React.SetStateAction<"" | keyof typeof EarningCategoryEnum>>
}

export default function EarningCategorySelector({category, setCategory}: EarningCategorySelectorProps) {
    const [search, setSearch] = useState<string>('')
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const options = getEarningCategoriesList()
    return (
        <>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setIsOpenModal(true)}>
                <Image style={styles.inputImage} source={require('../../assets/images/lista-de-controle.png')} />
                <Text style={styles.inputText}>  {category !== '' ? EarningCategoryEnum[category] : 'Selecione uma categoria'}</Text>
                <MaterialIcon name="expand-more" size={36} color={colors.mainColor} />
            </TouchableOpacity>
            <FullscreenModalTemplate visible={isOpenModal} transparent={true} animationType="slide">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContainer}>
                    <IconButton icon="close" size={36} color={colors.mainColor} onPress={() => setIsOpenModal(false)}/>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="search" />
                        <CustomInput.Input placeholder="Buscar categoria" value={search} onChangeText={text => setSearch(text)}/>
                    </CustomInput.Container>
                    {options.flatMap((option, index) => {
                        if (search !== "" && !option.label.toLowerCase().includes(search.toLowerCase())) {
                            return false
                        }
                        return (
                            <TouchableOpacity key={index} onPress={() => {
                                setIsOpenModal(false)
                                setCategory(option.value)
                            }} style={styles.itemContainer}>
                                <Image source={EarningCategoryImages[option.value]} style={styles.itemImage} />
                                <Text style={styles.itemText}>{option.label}</Text>
                                <View style={styles.circle}>
                                    {category === option.value && (
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
        padding: 18
    },
    itemImage: {
        width: 36,
        height: 36
    },
    itemText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        flex: 1,
        color: colors.text,
        textAlign: "center"
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
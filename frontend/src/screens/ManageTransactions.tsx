import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { moneyMask } from "../Utils/Mask";
import { useContext, useState } from "react";
import { backendApi } from "../configs/Api";
import { PopupContext } from "../contexts/PopupContext";
import { CreateGoalResponse } from "../types/ApiResponses/GoalTypes";
import { colors } from "../configs/Theme";
import IconButton from "../components/IconButton";

export default function ManageTransactions() {
    const [search, setSearch] = useState<string>("")
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="search" />
                    <CustomInput.Input placeholder="Buscar categoria" value={search} onChangeText={text => setSearch(text)} />
                </CustomInput.Container>
                <View style={styles.itemContainer}>
                    <Image source={require('../../assets/images/alvo.png')} style={styles.itemImage} />
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                    }}>
                        <Text style={{...styles.text, fontSize: 12, color: colors.text}}>Salário mensal</Text>
                        <Text style={{...styles.text, fontSize: 16, color: colors.mainColor}}>Salário</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <Text style={{...styles.text, fontSize: 16, color: colors.success}}>R$ 2550,00</Text>
                    </View>
                    <IconButton icon="delete" size={28} color={colors.mainColor}/>
                </View>
                <View style={styles.itemContainer}>
                    <Image source={require('../../assets/images/alvo.png')} style={styles.itemImage} />
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                    }}>
                        <Text style={{...styles.text, fontSize: 12, color: colors.text}}>Salário mensal</Text>
                        <Text style={{...styles.text, fontSize: 16, color: colors.mainColor}}>Salário</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <Text style={{...styles.text, fontSize: 16, color: colors.success}}>R$ 2550,00</Text>
                    </View>
                    <IconButton icon="delete" size={28} color={colors.mainColor}/>
                </View>
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
        padding: 18,
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
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../configs/Theme";
import { BalanceTypeEnum } from "../types/BalanceType";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import React from "react";

interface PaymentMethodSelectorProps {
    paymentMethod: keyof typeof BalanceTypeEnum
    setPaymentMethod: React.Dispatch<React.SetStateAction<keyof typeof BalanceTypeEnum>>
}


const balanceTypes: Array<{
    type: keyof typeof BalanceTypeEnum,
    label: BalanceTypeEnum,
    image: ImageSourcePropType
}> = [
    {
        type: 'SA',
        label: BalanceTypeEnum['SA'],
        image: require('../../assets/images/moedas.png')
    },
    {
        type: 'EC',
        label: BalanceTypeEnum['EC'],
        image: require('../../assets/images/cofrinho.png')
    }
]

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) {
    const { finances } = useContext(UserContext)
    return (
        <View style={styles.container}>
            {balanceTypes.map(({ type, label, image }, index) => (
                <TouchableOpacity
                    key={index} 
                    onPress={() => setPaymentMethod(type)}
                    style={{
                        ...styles.itemContainer,
                        backgroundColor: paymentMethod === type ? colors.mainColor : colors.sections
                    }}
                >
                    <Image style={styles.itemImage} source={image} />
                    <View style={styles.itemTextContainer}>
                        <Text style={{
                            ...styles.itemTextTitle,
                            color: paymentMethod === type ? colors.secondaryHighlight : colors.highlight
                        }}>{label}</Text>
                        <Text style={{
                            ...styles.itemTextValue,
                            color: paymentMethod === type ? colors.sections : colors.mainColor
                        }}>{(type === "EC" ? finances.currentSavings : finances.balance)?.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        height: 48,
        borderWidth: 1,
        borderColor: colors.mainColor,
        backgroundColor: colors.sections
    },
    itemContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderRadius: 18,
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    itemImage: {
        width: 36,
        height: 36
    },
    itemTextContainer: {
        gap: 4
    },
    itemTextTitle: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12
    },
    itemTextValue: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16
    }
})
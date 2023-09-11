import { Image, StyleSheet, Text, View } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import DataBox from "./DataBox";
import { colors } from "../configs/Theme";

export default function MovementCard() {
    return (
        <DataBox>
            <View style={styles.container}>
                <Image source={require('../../assets/images/educacao.png')} style={styles.categoryImage}/>
                <View style={{flex: 1, ...styles.columnContainer}}>
                    <Text style={{...styles.text, ...styles.movementText}}>Salário mensal</Text>
                    <Text style={{...styles.text, ...styles.categoryText}}>Salário</Text>
                </View>
                <View style={{...styles.columnContainer, alignItems: 'center'}}>
                    <MaterialIcon name="arrow-upward" size={28} color={colors.success}/>
                    <Text style={{...styles.text, ...styles.valueText}}>R$ 2550,99</Text>
                </View>
            </View>
        </DataBox>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center'
    },
    categoryImage: {
        width: 36,
        height: 36
    },
    text: {
        fontFamily: 'ComicNeue_400Regular',
    },
    categoryText: {
        fontSize: 16,
        color: colors.mainColor
    },
    movementText: {
        fontSize: 12,
        color: colors.text
    },
    valueText: {
        fontSize: 16,
        color: colors.highlight
    },
    columnContainer: {
        justifyContent: 'space-between',
        gap: 10
    }
})
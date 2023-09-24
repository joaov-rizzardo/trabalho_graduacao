import { Image, StyleSheet, Text, View } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import DataBox from "./DataBox";
import { colors } from "../configs/Theme";
import { TransactionType } from "../screens/HomePage";

interface MovementCardProps {
    transaction: TransactionType
}

export default function MovementCard({ transaction }: MovementCardProps) {
    return (
        <DataBox>
            <View style={styles.container}>
                <Image source={transaction.image} style={styles.categoryImage} />
                <View style={{ flex: 1, ...styles.columnContainer }}>
                    <Text style={{ ...styles.text, ...styles.movementText }}>{transaction.description}</Text>
                    <Text style={{ ...styles.text, ...styles.categoryText }}>{transaction.categoryDescription}</Text>
                </View>
                <View style={{ ...styles.columnContainer, alignItems: 'flex-end' }}>
                    <MaterialIcon name={transaction.type === 'S' ? 'arrow-downward' : 'arrow-upward'} size={28} color={transaction.type === 'S' ? colors.error : colors.success} />
                    <Text style={{ ...styles.text, ...styles.valueText }}>{transaction.value?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}</Text>
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
import DataBox from "../../../components/DataBox"
import {View, Image, Text, ImageSourcePropType, StyleSheet} from 'react-native'
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../../../configs/Theme";

interface TransactionCardProps {
    image: ImageSourcePropType
    categoryDescription: string
    value: number
    type: 'S' | 'E'
}

export default function TransactionCard({image, categoryDescription, value, type}: TransactionCardProps){
    return (
        <DataBox>
            <View style={styles.container}>
                <Image source={image} style={styles.categoryImage} />
                <View style={{ flex: 1, ...styles.columnContainer }}>
                    <Text style={{ ...styles.text, ...styles.categoryText }}>{categoryDescription}</Text>
                </View>
                <View style={{ ...styles.columnContainer, alignItems: 'flex-end' }}>
                    <MaterialIcon name={type === 'S' ? 'arrow-downward' : 'arrow-upward'} size={28} color={type === 'S' ? colors.error : colors.success} />
                    <Text style={{ ...styles.text, ...styles.valueText }}>{value?.toLocaleString('pt-BR', {
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
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native"
import { colors } from "../../../configs/Theme"

interface CategoryCardProps {
    image: ImageSourcePropType
    label: string
    value: number
}

export default function CategoryCard({ image, label, value }: CategoryCardProps) {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
            <Text style={styles.descriptionText}>{label}</Text>
            <Text style={styles.valueText}>{value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.sections,
        borderWidth: 2,
        padding: 16,
        borderRadius: 10,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
    },
    image: {
        width: 36,
        height: 36
    },
    descriptionText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.mainColor,
        flex: 1
    },
    valueText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.highlight,
    }

})
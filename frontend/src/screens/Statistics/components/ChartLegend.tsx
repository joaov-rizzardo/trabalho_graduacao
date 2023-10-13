import { Text, View, StyleSheet } from 'react-native'
import { colors } from '../../../configs/Theme'

interface ChartLegendProps {
    label: string
    color: string
}

export default function ChartLegend({label, color}: ChartLegendProps){
    return (
        <View style={styles.container}>
            <View style={{...styles.circle, backgroundColor: color}}/>
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center'
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10
    },
    text: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12,
        color: colors.text
    }
})
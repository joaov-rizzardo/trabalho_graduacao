import { Image, ImageSourcePropType, StyleSheet, Text, View, TouchableOpacity, TouchableOpacityProps} from "react-native"
import { colors } from "../../../configs/Theme"

interface ChartSelectorProps extends TouchableOpacityProps {
    active?: boolean
    label: string
    image: ImageSourcePropType
}

export default function ChartSelector({active, label, image, ...props}: ChartSelectorProps){
    return (
        <TouchableOpacity style={styles.container} {...props}>
            <Text style={styles.labelText}>{label}</Text>
            <View style={{...styles.imageContainer, borderColor: active ? colors.mainColor : colors.border}}>
                <Image style={styles.image} source={image} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 64,
        gap: 6
    },
    labelText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12,
        color: colors.highlight,
        textAlign: 'center'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 64,
        height: 64,
        borderRadius: 64,
        borderWidth: 2
    },
    image: {
        width: 36,
        height: 36
    }
})
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from "react-native";
import {colors} from '../configs/Theme'

interface CustomButtonProps extends TouchableOpacityProps {
    text: string,
    width?: number | string,
    isOutline?: boolean,
    loading?: boolean
}

export default function CustomButton({ text, width = '100%', isOutline = false, loading = false, ...props }: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={{
                ...styles.container,
                width: width,
                backgroundColor: isOutline ? colors.background : colors.mainColor
            }}
            {...props}
        >
            {
                loading
                    ? <ActivityIndicator size="large" color={isOutline ? colors.mainColor : colors.text} />
                    : <Text
                        style={{
                            ...styles.textStyle,
                            color: isOutline ? colors.mainColor : colors.background
                        }}
                    >{text}</Text>
            }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.mainColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        fontFamily: 'ComicNeue_400Regular'
    }
})
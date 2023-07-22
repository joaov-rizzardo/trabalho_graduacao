import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";
import { colors } from "../configs/theme";

interface CustomButtonProps extends TouchableOpacityProps{
    text: string,
    width?: number,
    isOutline?: boolean
}

export default function CustomButton({text, width = 330, isOutline = false, ...props}: CustomButtonProps){
    return (
        <TouchableOpacity 
            style={{
                ...styles.container,
                width: width,
                backgroundColor: isOutline ? colors.background : colors.mainColor
            }}
            {...props}
        >
            <Text
                style={{
                    ...styles.textStyle,
                    color: isOutline ? colors.mainColor : colors.text
                }}
            >{text}</Text>
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
        fontSize: 20
    }
})
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { colors } from "../configs/Theme";

interface GaugeProps extends TouchableOpacityProps{
    text: string
    isOutline?: boolean
    image?: ImageSourcePropType
}

export function Gauge({text, isOutline = true, image, ...props}: GaugeProps){
    const containerColorStyle = isOutline ? styles.outlineStyle : styles.selectedStyle
    return (
        <TouchableOpacity style={{
            ...styles.container,
            ...containerColorStyle
        }} {...props}>
            <Text style={{
                fontFamily: 'ComicNeue_400Regular',
                fontSize: 16,
                color: isOutline ? colors.mainColor : colors.sections,
                flex: 1,
                textAlign: 'center'
            }}>{text}</Text>
            {image && <Image source={image} style={{width: 36, height: 36}}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.mainColor,
        gap: 6,
        flex: 1
    },
    outlineStyle: {
        backgroundColor: 'transparent',
    },
    selectedStyle: {
        backgroundColor: colors.mainColor
    }
})
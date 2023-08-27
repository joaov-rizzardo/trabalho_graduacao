import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../configs/Theme";

interface DataBoxProps {
    children: ReactNode
    style?: ViewStyle
}

export default function DataBox({children, style}: DataBoxProps){
    return (
        <View style={{
            width: '100%',
            borderRadius: 10,
            padding: 16,
            backgroundColor: colors.sections,
            borderWidth: 2,
            borderColor: colors.border,
            height: 70,
            ...style
        }}>
            {children}
        </View>
    )
}
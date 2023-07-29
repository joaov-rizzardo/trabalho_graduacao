import { ReactNode } from "react";
import { View } from "react-native";
import { colors } from "../../configs/Theme";

interface InputContainerProps {
    children: ReactNode,
    width?: number | string
}
export default function InputContainer({children, width = "100%"}: InputContainerProps){
    return (
        <View style={{
            width: width,
            height: 48,
            flexDirection: 'row',
            gap: 20,
            padding: 2,
            backgroundColor: colors.sections,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 10
        }}>
            {children}
        </View>
    )
}
import { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../configs/Theme";

interface ScreenTemplateProps {
    children: ReactNode
}

export default function ScreenTemplate({children}: ScreenTemplateProps){
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../assets/images/logo.png')}
                    style={{
                        height: '90%',
                        aspectRatio: 500 / 136
                    }}
                />
            </View>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainColor
    },
    logoContainer: {
        width: '100%',
        height: '10%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
        backgroundColor: colors.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    }
})
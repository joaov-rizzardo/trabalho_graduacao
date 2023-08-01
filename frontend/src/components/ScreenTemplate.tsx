import { ReactNode, useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../configs/Theme";
import IconButton from "./IconButton";
import { AuthContext } from "../contexts/AuthContext";

interface ScreenTemplateProps {
    children: ReactNode
}

export default function ScreenTemplate({children}: ScreenTemplateProps){
    const {logout, authenticated} = useContext(AuthContext)
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../assets/images/logo.png')}
                    style={{
                        height: '90%',
                        maxWidth: '50%',
                        aspectRatio: 500 / 136
                    }}
                />
                {authenticated && <IconButton icon="logout" color={colors.background} onPress={logout}/>}
                
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
        height: 80,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
import { View, StyleSheet, Image } from 'react-native'
import {Text} from 'react-native'
import { colors } from '../configs/theme'
import CustomButton from '../components/CustomButton'

export default function Login(){
    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image style={styles.logoImage} source={require('../../assets/images/logo_branco.png')}/>
            </View>
            <View style={styles.loginContent}>
                <CustomButton text="Clique aqui"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.mainColor
    },
    logoSection: {
        height: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImage: {
        width: 220,
        height: 220
    },
    loginContent: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    }
})
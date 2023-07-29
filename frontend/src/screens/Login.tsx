import { View, StyleSheet, Image, Text } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { colors } from '../configs/Theme'

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image style={styles.logoImage} source={require('../../assets/images/logo_branco.png')} />
            </View>
            <View style={styles.loginContent}>
                <View style={styles.inputsContainer}>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="person" />
                        <CustomInput.Input placeholder='Usuário' />
                    </CustomInput.Container>

                    <CustomInput.Container>
                        <CustomInput.Icon iconName="lock" />
                        <CustomInput.Input
                            secureTextEntry={true} 
                            placeholder='Senha' 
                        />
                    </CustomInput.Container>
                </View>
                <View style={styles.buttonsContainer}>
                    <CustomButton text="Entrar" />
                    <CustomButton text="Cadastre-se" isOutline={true} />
                </View>
                <Text style={styles.textActionStyle}>Esqueci minha senha</Text>
                
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
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
        backgroundColor: colors.background,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    },
    inputsContainer: {
        gap: 20
    },
    buttonsContainer: {
        gap: 20
    },
    textActionStyle: {
        color: colors.highlight,
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20
    }
})
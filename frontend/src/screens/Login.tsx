import { View, StyleSheet, Image, Text } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { colors } from '../configs/Theme'
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthStackNavigationType } from '../routers/AuthRouter'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'

interface LoginProps {
    navigation: StackNavigationProp<AuthStackNavigationType, "HomePage", "RecoveryPassword">
}

export default function Login({navigation}: LoginProps) {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginLoading, setLoginLoading] = useState<boolean>(false)
    const {login, logout} = useContext(AuthContext)

    //useEffect(() => {logout()}, [])

    async function handleLoginButtonPress(){
        setLoginLoading(true)
        const response = await login({username, password})
        if(response !== false){
            navigation.navigate('HomePage')
        }else{
            console.log('Error')
        }
        setLoginLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image style={styles.logoImage} source={require('../../assets/images/logo_branco.png')} />
            </View>
            <View style={styles.loginContent}>
                <View style={styles.inputsContainer}>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="person" />
                        <CustomInput.Input 
                            placeholder='Usuário'
                            value={username}
                            onChangeText={text => setUsername(text)}
                        />
                    </CustomInput.Container>

                    <CustomInput.Container>
                        <CustomInput.Icon iconName="lock" />
                        <CustomInput.Input
                            secureTextEntry={true} 
                            placeholder='Senha'
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                    </CustomInput.Container>
                </View>
                <View style={styles.buttonsContainer}>
                    <CustomButton 
                        text="Entrar"
                        disabled={(password === "" || username === "")}
                        loading={loginLoading}
                        onPress={handleLoginButtonPress}
                    />
                    <CustomButton text="Cadastre-se" isOutline={true} />
                </View>
                <Text style={styles.textActionStyle} onPress={() => {
                    navigation.navigate('RecoveryPassword')
                }}>Esqueci minha senha</Text>
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
        paddingHorizontal: 24,
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
        backgroundColor: colors.background,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    },
    inputsContainer: {
        width: '100%',
        gap: 20
    },
    buttonsContainer: {
        width: '100%',
        gap: 20
    },
    textActionStyle: {
        color: colors.highlight,
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20
    }
})
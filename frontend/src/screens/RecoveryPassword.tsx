import { ScrollView, View, Text, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CodeInput from "../components/CodeInput";
import { useContext, useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { colors } from "../configs/Theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { RouteProp } from "@react-navigation/native";
import { backendApi } from "../configs/Api";
import { sendVerificationTokenType, updatePasswordType } from "../types/ApiResponses/AuthenticationTypes";
import { PopupContext } from "../contexts/PopupContext";
import axios, { AxiosError } from "axios";

interface RecoveryPasswordProps {
    route: RouteProp<AuthStackNavigationType, 'RecoveryPassword'>
    navigation: StackNavigationProp<AuthStackNavigationType, 'RecoveryPassword'>
}

export default function RecoveryPassword({route, navigation}: RecoveryPasswordProps) {
    const [code, setCode] = useState<string>('')
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [verifyPassword, setVerifyPassword] = useState<string>('')
    const {openAlertPopup} = useContext(PopupContext)
    const [resendInterval, setResendInterval] = useState<NodeJS.Timer>()
    const [timeToResend, setTimeToResend] = useState<number>(0)
    useEffect(() => {
        handleSendingVerificationCode()
    }, [])

    useEffect(() => {
        if(timeToResend !== 0 && resendInterval === undefined){
            setResendInterval(setInterval(() => {
                setTimeToResend(prevTime => prevTime - 1)
            }, 1000))
        }
        if(timeToResend === 0 && resendInterval !== undefined){
            clearInterval(resendInterval)
            setResendInterval(undefined)
        }
    }, [timeToResend])

    function initResendCounter(){
        setTimeToResend(30)
    }

    async function handleSendingVerificationCode(){
        initResendCounter()
        const {ok} = await sendVerificationCode(route.params.userId)
        if(ok === false){
            openAlertPopup({
                content: 'Não foi possível enviar o código de verificação, tente novamente mais tarde.'
            })
        }
    }

    async function handleChangePassword(){
        const validationResponse = validateFields()
        if(validationResponse.ok === false){
            openAlertPopup({
                content: validationResponse.message
            })
            return false
        }
        const changePasswordResponse = await changePassword(route.params.userId)
        if(changePasswordResponse.ok === false){
            openAlertPopup({
                content: changePasswordResponse.message
            })
            return false
        }
        openAlertPopup({
            content: 'Sua senha foi alterada com sucesso, realize login com a nova senha cadastrada',
            buttonText: 'Fazer login',
            buttonFunction: () => {
                navigation.navigate('Login')
            }        })
    }

    async function changePassword(userId: number){
        try{
            await backendApi.post<updatePasswordType>(`/authentication/updatePassword/${userId}`, {
                newPassword: password,
                validationCode: code
            })
            return {ok: true, message: ''}
        }catch(error: any){
            if(axios.isAxiosError(error)){
                const axiosError: AxiosError = error
                if(axiosError.response?.status === 400){
                    return {ok: false, message: 'O código de verificação informado é inválido, tente novamente'}
                }
            }
            return {ok: false, message: 'Não foi possível se comunicar com o servidor, tente novamente mais tarde.'}
        }
    }

    function validateFields(){
        if(password.length < 8){
            return {
                ok: false,
                message: 'Sua nova senha deve ter no minimo 8 caracteres'
            }
        }
        if(password !== verifyPassword){
            return {
                ok: false,
                message: 'As senhas informadas não se coincidem.'
            }
        }
        if(code.length !== 5){
            return {
                ok: false,
                message: 'Por favor, informe o código de verificação para prosseguir'
            }
        }
        return {ok: true, message: ''}
    }

    async function sendVerificationCode(userId: number){
        try {
            await backendApi.post<sendVerificationTokenType>(`/authentication/sendVerificationCode/${userId}`)
            return {ok: true}
        }catch(error: any){
            return {ok: false}
        }
    }
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.inputsContainer}>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="lock" />
                        <CustomInput.Input 
                            placeholder="Nova Senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                    </CustomInput.Container>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="done" />
                        <CustomInput.Input 
                            placeholder="Confirme a senha"
                            secureTextEntry={true}
                            value={verifyPassword}
                            onChangeText={text => setVerifyPassword(text)}
                        />
                    </CustomInput.Container>
                </View>
                <Text style={styles.text}>
                    Para garantir a segurança da sua conta, enviamos um código de verificação para o e-mail cadastrado. {'\n\n'}Por favor, verifique sua caixa de entrada e insira o código abaixo para alterar sua senha:
                </Text>
                <CodeInput changeValue={setCode}/>
                <View style={styles.buttonsContainer}>
                    <CustomButton 
                        text="Alterar senha"
                        loading={buttonLoading}
                        onPress={async () => {
                            setButtonLoading(true)
                            await handleChangePassword()
                            setButtonLoading(false)
                        }}
                    />
                    <CustomButton 
                        text={timeToResend !== 0 ? timeToResend.toString() : "Reenviar código"} 
                        isOutline={true}
                        disabled={timeToResend !== 0}
                        onPress={handleSendingVerificationCode}
                    />
                </View>
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24
    },
    inputsContainer: {
        gap: 24
    },
    text: {
        fontSize: 20,
        fontFamily: 'ComicNeue_400Regular',
        color: colors.text,
        textAlign: 'center'
    },
    buttonsContainer: {
        width: '100%',
        gap: 24
    }
})
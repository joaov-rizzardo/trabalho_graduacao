import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { colors } from "../configs/Theme";
import CustomButton from "../components/CustomButton";
import CodeInput from "../components/CodeInput";
import { useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { AuthContext } from "../contexts/AuthContext";
import { backendApi } from "../configs/Api";
import { sendVerificationTokenType } from "../types/ApiResponses/AuthenticationTypes";
import { PopupContext } from "../contexts/PopupContext";

interface EmailValidationProps {
    navigation: StackNavigationProp<AuthStackNavigationType>
}

export default function EmailValidation({navigation}: EmailValidationProps){
    const {user, validateEmail} = useContext(AuthContext)
    const [code, setCode] = useState<string>('')
    const {openAlertPopup} = useContext(PopupContext)
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
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

    async function handleEmailValidation(){
        if(code.length < 5){
            openAlertPopup({
                content: 'Por favor, informe o código para realizar a validação do email.'
            })
            return false
        }
        const {ok, message} = await validateEmail(code)
        if(ok === false){
            openAlertPopup({
                content: message
            })
            return false
        }
        navigation.navigate('HomePage')
    }

    async function handleSendingVerificationCode(){
        initResendCounter()
        const {ok} = await sendVerificationCode(user.userId)
        if(ok === false){
            openAlertPopup({
                content: 'Não foi possível enviar o código de verificação, tente novamente mais tarde.'
            })
        }
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
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Image style={styles.image} source={require('../../assets/images/abrir-e-mail.png')}/>
                <Text style={styles.text}>
                    Para garantir a segurança da sua conta, enviamos um código de verificação para o e-mail cadastrado.{'\n\n'}Por favor, verifique sua caixa de entrada e insira o código abaixo para validar seu e-mail:
                </Text>
                <CodeInput changeValue={setCode}/>
                <View style={styles.buttonsContainer}>
                    <CustomButton 
                        loading={buttonLoading}
                        onPress={async () => {
                            setButtonLoading(true)
                            await handleEmailValidation()
                            setButtonLoading(false)
                        }}
                        text="Validar"
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
        gap: 32,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 20,
        fontFamily: 'ComicNeue_400Regular',
        color: colors.text,
        textAlign: 'center'
    },
    image: {
        height: 100,
        aspectRatio: 1/1
    },
    buttonsContainer: {
        width: '100%',
        gap: 24
    }
})
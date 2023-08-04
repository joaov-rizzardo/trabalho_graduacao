import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { colors } from "../configs/Theme";
import { useContext, useState } from "react";
import { PopupContext } from "../contexts/PopupContext";
import { backendApi } from "../configs/Api";
import { searchUserIdByEmailOrUsernameType } from "../types/ApiResponses/AuthenticationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";

interface ForgetPasswordProps {
    navigation: StackNavigationProp<AuthStackNavigationType>
}

export default function ForgetPassword({navigation}: ForgetPasswordProps){
    const [user, setUser] = useState<string>('')
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)
    const {openAlertPopup} = useContext(PopupContext)
    async function handlePasswordRecovery(){
        if(user === ''){
            openAlertPopup({
                content: 'Por favor, informe o email ou o nome de usuário para recuperar sua senha!'
            })
            return false
        }
        const {userId, message} = await findUserByEmailOrUsername()
        if(userId === false){
            openAlertPopup({
                content: message
            })
            return false
        }
        navigation.navigate('RecoveryPassword', {userId: userId})
    }

    async function findUserByEmailOrUsername(): Promise<{userId: number | false, message: string}>{
        try{
            const {data: {userId}} = await backendApi.post<searchUserIdByEmailOrUsernameType>('/authentication/searchUserIdByEmailOrUsername', {
                userInfo: user
            })
            if(userId === false){
                return {
                    userId: false,
                    message: 'O endereço de email/usuário informado não existe em nossa base de dados'
                }
            }
            return {
                userId: userId,
                message: ''
            }
        }catch(error: any){
            return {
                userId: false,
                message: 'Não foi possível se comunicar com o servidor, tente novamente mais tarde'
            }
        }
    }
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Image style={styles.image} source={require('../../assets/images/confusao.png')} />
                    <View style={styles.textsContainer}>
                        <Text style={styles.textHighligh}>Esqueceu a sua senha?</Text>
                        <Text style={styles.textSecondaryHighligh}>Não se preocupe!</Text>
                    </View>
                </View>
                <Text style={styles.text}>Informe seu nome de usuário ou endereço de e-mail no campo abaixo. {'\n\n'}Assim, enviaremos um código de verificação para o e-mail cadastrado, permitindo que você altere sua senha com segurança.</Text>
                <View style={styles.actionsContainer}>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="person" />
                        <CustomInput.Input 
                            placeholder="Usuário ou Email" 
                            value={user}
                            onChangeText={text => setUser(text)}
                        />
                    </CustomInput.Container>
                    <CustomButton 
                        text="Recuperar senha"
                        loading={buttonLoading}
                        onPress={async () => {
                            setButtonLoading(true)
                            await handlePasswordRecovery()
                            setButtonLoading(false)
                        }}
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
    headerContainer: {
        gap: 20,
        alignItems: 'center'
    },
    image: {
        height: 100,
        aspectRatio: 1/1
    },
    textsContainer: {
        gap: 4,
        alignItems: 'center'
    },
    textHighligh: {
        fontSize: 28,
        fontFamily: 'ComicNeue_700Bold',
        color: colors.secondaryHighlight
    },
    textSecondaryHighligh: {
        fontSize: 20,
        fontFamily: 'ComicNeue_700Bold',
        color: colors.highlight
    },
    text: {
        fontSize: 20,
        fontFamily: 'ComicNeue_400Regular',
        color: colors.text,
        textAlign: 'center'
    },
    actionsContainer: {
        width: '100%',
        gap: 24
    }
})
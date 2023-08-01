import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { colors } from "../configs/Theme";
import CustomButton from "../components/CustomButton";
import CodeInput from "../components/CodeInput";
import { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackActions } from '@react-navigation/native';
import { AuthStackNavigationType } from "../routers/AuthRouter";
interface EmailValidationProps {
    navigation: StackNavigationProp<AuthStackNavigationType>
}
export default function EmailValidation({navigation}: EmailValidationProps){
    const [code, setCode] = useState<string>('')
    return (
        <ScreenTemplate>
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Image style={styles.image} source={require('../../assets/images/abrir-e-mail.png')}/>
                <Text style={styles.text}>
                    Para garantir a segurança da sua conta, enviamos um código de verificação para o e-mail cadastrado.{'\n\n'}Por favor, verifique sua caixa de entrada e insira o código abaixo para validar seu e-mail:
                </Text>
                <CodeInput changeValue={setCode}/>
                <View style={styles.buttonsContainer}>
                    <CustomButton onPress={() => navigation.dispatch(StackActions.replace('HomePage'))} text="Validar"/>
                    <CustomButton text="Reenviar código" isOutline={true} />
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
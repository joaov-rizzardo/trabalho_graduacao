import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { colors } from "../configs/theme";
import CustomButton from "../components/CustomButton";
import CodeInput from "../components/CodeInput";
import { useState } from "react";

export default function EmailValidation(){
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
                    <CustomButton text="Validar"/>
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
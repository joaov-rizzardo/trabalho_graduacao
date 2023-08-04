import { ScrollView, View, Text, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CodeInput from "../components/CodeInput";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import { colors } from "../configs/Theme";

export default function RecoveryPassword() {
    const [code, setCode] = useState<string>('')
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.inputsContainer}>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="lock" />
                        <CustomInput.Input placeholder="Nova Senha" />
                    </CustomInput.Container>
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="done" />
                        <CustomInput.Input placeholder="Confirme a senha" />
                    </CustomInput.Container>
                </View>
                <Text style={styles.text}>
                    Para garantir a segurança da sua conta, enviamos um código de verificação para o e-mail tes****@hotmail.com. {'\n\n'}Por favor, verifique sua caixa de entrada e insira o código abaixo para alterar sua senha:
                </Text>
                <CodeInput changeValue={setCode}/>
                <View style={styles.buttonsContainer}>
                    <CustomButton text="Alterar senha" />
                    <CustomButton text="Reenviar código" isOutline={true}/>
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
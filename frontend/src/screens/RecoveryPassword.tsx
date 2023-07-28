import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { colors } from "../configs/theme";

export default function RecoveryPassword(){
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
                        <CustomInput.Input placeholder="Usuário ou Email" />
                    </CustomInput.Container>
                    <CustomButton text="Recuperar senha"/>
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
import { ScrollView, StyleSheet} from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function Register(){
    return (
        <ScreenTemplate>
            <ScrollView contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="person"/>
                    <CustomInput.Input placeholder="Usuário"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="badge"/>
                    <CustomInput.Input placeholder="Nome"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="face"/>
                    <CustomInput.Input placeholder="Sobrenome"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="lock"/>
                    <CustomInput.Input placeholder="Senha"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="done"/>
                    <CustomInput.Input placeholder="Confirme a Senha"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="mail"/>
                    <CustomInput.Input placeholder="Email"/>
                </CustomInput.Container>
                <CustomButton text="Cadastrar"/>
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 32,
        alignItems: 'center'
    }
})
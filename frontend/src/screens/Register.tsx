import { ScrollView, StyleSheet, Text } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";

export default function Register(){
    return (
        <ScreenTemplate>
            <ScrollView contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="person"/>
                    <CustomInput.Input placeholder="Usuário"/>
                </CustomInput.Container>
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 24,
        alignItems: 'center'
    }
})
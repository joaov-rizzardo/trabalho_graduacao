import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ActionsStackNavigationType } from "../routers/ActionsRouter";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import EarningCategorySelector from "../components/EarningCategorySelector";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { EarningCategoryEnum } from "../types/CategoryTypes";

export default function CreateEarning() {
    const [category, setCategory] = useState<keyof typeof EarningCategoryEnum | ''>('')
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="description" />
                    <CustomInput.Input placeholder="Descrição" />
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input placeholder="Valor" />
                </CustomInput.Container>
                <EarningCategorySelector category={category} setCategory={setCategory} />
                <CustomButton text="Realizar lançamento" />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 28
    }
})
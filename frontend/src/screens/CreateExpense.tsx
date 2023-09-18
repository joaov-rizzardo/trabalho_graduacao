import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActionsStackNavigationType } from "../routers/ActionsRouter";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { BalanceTypeEnum } from "../types/BalanceType";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import SpendingCategorySelector from "../components/SpendingCategorySelector";
import { SpendingCategoryEnum } from "../types/CategoryTypes";

interface CreateSpendingProps {
    navigation: StackNavigationProp<ActionsStackNavigationType, "CreateExpense", "CreateEarning">
}

export default function CreateExpense({navigation}: CreateSpendingProps){
    const [paymentMethod, setPaymentMethod] = useState<keyof typeof BalanceTypeEnum>('SA')
    const [category, setCategory] = useState<keyof typeof SpendingCategoryEnum | ''>('')
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="description" />
                    <CustomInput.Input placeholder="Descrição"/>
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input placeholder="Valor"/>
                </CustomInput.Container>
                <SpendingCategorySelector category={category} setCategory={setCategory}/>
                <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/>
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
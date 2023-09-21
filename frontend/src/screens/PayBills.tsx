import { ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useEffect, useState } from "react";
import { GetInstallmentsType } from "../types/ApiResponses/BillTypes";
import InstallmentSelector from "../components/InstallmentSelector";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { BalanceTypeEnum } from "../types/BalanceType";
import { moneyMask } from "../Utils/Mask";

export default function PayBills() {
    const [installment, setInstallment] = useState<GetInstallmentsType | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<keyof typeof BalanceTypeEnum>('SA')
    const [paymentValue, setPaymentValue] = useState<number>(0)
    useEffect(() => {
        if(installment !== null){
            setPaymentValue(installment.value)
        }else{
            setPaymentValue(0)
        }
    }, [installment])
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <InstallmentSelector selectedInstallment={installment} setInstallment={setInstallment} />
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input keyboardType="number-pad" placeholder="Valor pago" value={paymentValue > 0 ? moneyMask(paymentValue.toString()) : ''} onChangeText={text => setPaymentValue(parseFloat(text))}/>
                </CustomInput.Container>
                <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/>
                <CustomButton text="Pagar conta" />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 28
    }
})
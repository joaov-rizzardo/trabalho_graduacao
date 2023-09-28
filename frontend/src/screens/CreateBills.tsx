import { ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import SpendingCategorySelector from "../components/SpendingCategorySelector";
import { moneyMask } from "../Utils/Mask";
import { useState } from "react";
import { SpendingCategoryEnum } from "../types/CategoryTypes";
import OptionSelector from "../components/OptionSelector";
import Datepicker from "../components/Datepicker";
import { colors } from "../configs/Theme";

export default function CreateBills() {
    const [description, setDescription] = useState<string>('')
    const [category, setCategory] = useState<keyof typeof SpendingCategoryEnum | ''>('')
    const [value, setValue] = useState<string>('')
    const [billType, setBillType] = useState<'V' | 'F'>('F')
    const [installmentsQuantity, setInstallmentsQuantity] = useState<string>('')
    const [dueDate, setDueDate] = useState<Date | null>(null)
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <CustomInput.Container>
                    <CustomInput.Icon iconName="description" />
                    <CustomInput.Input
                        placeholder="Descrição"
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                </CustomInput.Container>
                <SpendingCategorySelector category={category} setCategory={setCategory} />
                <CustomInput.Container>
                    <CustomInput.Icon iconName="attach-money" />
                    <CustomInput.Input
                        placeholder="Valor da parcela"
                        value={value}
                        onChangeText={text => setValue(moneyMask(text))}
                    />
                </CustomInput.Container>
                <View>
                    <Datepicker date={dueDate} setDate={setDueDate} placeholder="Vencimento 1ª parcela" />
                    <Text style={styles.installmentsDescription}>As demais parcelas serão geradas no mesmo dia de vencimento</Text>
                </View>
                <OptionSelector
                    options={[
                        { value: 'F', description: 'Fixo' },
                        { value: 'V', description: 'Variável' }
                    ]}
                    value={billType}
                    setValue={setBillType}
                />
                {billType === "V" && (
                    <CustomInput.Container>
                        <CustomInput.Icon iconName="format-list-numbered" />
                        <CustomInput.Input
                            placeholder="Número de parcelas"
                            value={installmentsQuantity}
                            onChangeText={text => setInstallmentsQuantity(text.replace(/\D/g, ''))}
                        />
                    </CustomInput.Container>
                )}
                <CustomButton text="Cadastrar conta" />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 28
    },
    installmentsDescription: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12,
        color: colors.highlight,
        textAlign: 'center',
        marginTop: 10
    }
})
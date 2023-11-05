import { ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import SpendingCategorySelector from "../components/SpendingCategorySelector";
import { moneyMask } from "../Utils/Mask";
import { useContext, useState } from "react";
import { SpendingCategoryEnum } from "../types/CategoryTypes";
import OptionSelector from "../components/OptionSelector";
import Datepicker from "../components/Datepicker";
import { colors } from "../configs/Theme";
import { backendApi } from "../configs/Api";
import { CreateBillType } from "../types/ApiResponses/BillTypes";
import { formatDateToString } from "../Utils/DateUtils";
import { PopupContext } from "../contexts/PopupContext";

export default function CreateBills() {
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<
    keyof typeof SpendingCategoryEnum | ""
  >("");
  const [value, setValue] = useState<string>("");
  const [billType, setBillType] = useState<"V" | "F">("F");
  const [installmentsQuantity, setInstallmentsQuantity] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { openAlertPopup } = useContext(PopupContext);

  async function createBill() {
    try {
      const { ok, message } = handleValidations();
      if (ok === false) {
        return openAlertPopup({
          title: "Atenção",
          content: message,
        });
      }
      await backendApi.post<CreateBillType>("/bill/create", {
        billType: billType,
        category: category,
        description: description,
        installments:
          installmentsQuantity !== "" && parseInt(installmentsQuantity),
        installmentValue: value !== "" ? parseFloat(value) : 0,
        paymentDay: dueDate !== null && dueDate.getDate(),
        firstDatePayment: dueDate !== null && formatDateToString(dueDate),
      });
      clearData();
      return openAlertPopup({
        title: "Sucesso",
        content: "A conta foi cadastrada com sucesso",
      });
    } catch (error: any) {
      console.log(error);
      return openAlertPopup({
        title: "Atenção",
        content: "Não foi possível criar a conta, tente novamente mais tarde",
      });
    }
  }

  function clearData() {
    setDescription("");
    setCategory("");
    setValue("");
    setBillType("F");
    setInstallmentsQuantity("");
    setDueDate(null);
  }

  function handleValidations() {
    const installmentValue = value !== "" ? parseFloat(value) : 0;
    const installments =
      installmentsQuantity !== "" ? parseInt(installmentsQuantity) : 0;
    if (description.trim() === "") {
      return {
        ok: false,
        message: "Por favor, informe uma descrição para a conta.",
      };
    }
    if (category === "") {
      return {
        ok: false,
        message: "Por favor, selecione uma categoria para a conta.",
      };
    }
    if (installmentValue <= 0) {
      return { ok: false, message: "O valor deve ser superior a zero." };
    }
    if (billType === "V" && installments <= 0) {
      return {
        ok: false,
        message: "Por favor, informe a quantidade de parcelas",
      };
    }
    if (dueDate === null) {
      return { ok: false, message: "Por favor, informe a data de vencimento." };
    }
    if (new Date(dueDate).getTime() <= new Date().getTime()) {
      return {
        ok: false,
        message: "A data de vencimento deve ser posterior a data de hoje",
      };
    }
    return { ok: true, message: "" };
  }

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <CustomInput.Container>
          <CustomInput.Icon iconName="description" />
          <CustomInput.Input
            placeholder="Descrição"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </CustomInput.Container>
        <SpendingCategorySelector
          category={category}
          setCategory={setCategory}
        />
        <CustomInput.Container>
          <CustomInput.Icon iconName="attach-money" />
          <CustomInput.Input
            placeholder="Valor da parcela"
            value={value}
            onChangeText={(text) => setValue(moneyMask(text))}
          />
        </CustomInput.Container>
        <View>
          <Datepicker
            date={dueDate}
            setDate={setDueDate}
            placeholder="Vencimento 1ª parcela"
          />
          <Text style={styles.installmentsDescription}>
            As demais parcelas serão geradas no mesmo dia de vencimento
          </Text>
        </View>
        <OptionSelector
          options={[
            { value: "F", description: "Fixo" },
            { value: "V", description: "Variável" },
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
              onChangeText={(text) =>
                setInstallmentsQuantity(text.replace(/\D/g, ""))
              }
            />
          </CustomInput.Container>
        )}
        <CustomButton
          text="Cadastrar conta"
          loading={isCreating}
          onPress={async () => {
            setIsCreating(true);
            await createBill();
            setIsCreating(false);
          }}
        />
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
  installmentsDescription: {
    fontFamily: "ComicNeue_400Regular",
    fontSize: 12,
    color: colors.highlight,
    textAlign: "center",
    marginTop: 10,
  },
});

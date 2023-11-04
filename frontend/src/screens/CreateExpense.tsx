import { ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useContext, useState } from "react";
import { BalanceTypeEnum } from "../types/BalanceType";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import SpendingCategorySelector from "../components/SpendingCategorySelector";
import { SpendingCategoryEnum } from "../types/CategoryTypes";
import { UserContext } from "../contexts/UserContext";
import { PopupContext } from "../contexts/PopupContext";
import { backendApi } from "../configs/Api";
import { CreateSpendingType } from "../types/ApiResponses/TransactionTypes";
import { moneyMask } from "../Utils/Mask";

export default function CreateExpense() {
  const [paymentMethod, setPaymentMethod] =
    useState<keyof typeof BalanceTypeEnum>("SA");
  const [category, setCategory] = useState<
    keyof typeof SpendingCategoryEnum | ""
  >("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const { finances, level, updateFinances, updateLevel } =
    useContext(UserContext);
  const { openAlertPopup, openModalRewards, openModalLevelup } =
    useContext(PopupContext);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  async function handleCreateSpending() {
    try {
      const { ok, message } = handleValidations();
      if (ok === false) {
        return openAlertPopup({
          content: message,
        });
      }
      const {
        data: { rewards, userFinance, userLevel },
      } = await backendApi.post<CreateSpendingType>(
        "/transaction/spending/create",
        {
          description: description.trim(),
          value: parseFloat(value),
          categoryKey: category,
          balanceType: paymentMethod,
        }
      );
      const levelUp = userLevel.currentLevel > level.currentLevel;
      updateFinances({
        balance: userFinance.balance,
        currentSavings: userFinance.currentSavings,
        totalSavings: userFinance.currentSavings,
      });
      updateLevel({
        currentLevel: userLevel.currentLevel,
        currentXp: userLevel.currentXp,
        points: userLevel.points,
        xpToNextLevel: userLevel.xpToNextLevel,
      });
      clearData();
      openModalRewards({
        points: rewards.points,
        xp: rewards.xp,
        close: () => {
          if (levelUp) {
            openModalLevelup({
              level: userLevel.currentLevel,
              avatarRewards: userLevel.earnedAvatars.map(
                (avatar) => avatar.avatarId
              ),
            });
          }
        },
      });
    } catch (error: any) {
      console.log(error);
      return openAlertPopup({
        content:
          "Não foi possível realizar o lançamento, tente novamente mais tarde",
      });
    }
  }

  function handleValidations() {
    const floatValue = parseFloat(value);
    if (floatValue <= 0) {
      return {
        ok: false,
        message: "O valor do lançamento deve ser superior a zero",
      };
    }
    if (description.trim() === "") {
      return {
        ok: false,
        message: "Por favor, informe uma descrição para o lançamento",
      };
    }
    if (category === "") {
      return { ok: false, message: "Informe uma categoria para o lançamento" };
    }
    if (paymentMethod === "EC" && finances.currentSavings < floatValue) {
      return {
        ok: false,
        message: "Economias insuficientes para realizar o lançamento",
      };
    }
    if (paymentMethod === "SA" && finances.balance < floatValue) {
      return {
        ok: false,
        message: "Saldo insuficiente para realizar o lançamento",
      };
    }
    return { ok: true, message: "" };
  }

  function clearData() {
    setValue("");
    setCategory("");
    setDescription("");
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
        <CustomInput.Container>
          <CustomInput.Icon iconName="attach-money" />
          <CustomInput.Input
            placeholder="Valor"
            value={value}
            onChangeText={(text) => setValue(moneyMask(text))}
          />
        </CustomInput.Container>
        <SpendingCategorySelector
          category={category}
          setCategory={setCategory}
        />
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <CustomButton
          text="Realizar lançamento"
          onPress={async () => {
            setIsCreating(true);
            await handleCreateSpending();
            setIsCreating(false);
          }}
          loading={isCreating}
        />
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
});

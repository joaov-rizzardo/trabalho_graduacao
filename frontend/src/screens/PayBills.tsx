import { ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useContext, useEffect, useRef, useState } from "react";
import {
  GetInstallmentsType,
  PayInstallmentType,
} from "../types/ApiResponses/BillTypes";
import InstallmentSelector, {
  EarningCategorySelectorProps,
  InstallmentSelectorRef,
} from "../components/InstallmentSelector";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { BalanceTypeEnum } from "../types/BalanceType";
import { PopupContext } from "../contexts/PopupContext";
import { UserContext } from "../contexts/UserContext";
import { backendApi } from "../configs/Api";
import { moneyMask } from "../Utils/Mask";

export default function PayBills() {
  const selectorRef = useRef<null | InstallmentSelectorRef>(null);
  const [installment, setInstallment] = useState<GetInstallmentsType | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] =
    useState<keyof typeof BalanceTypeEnum>("SA");
  const [paymentValue, setPaymentValue] = useState<string>("");
  const {
    openConfirmPopUp,
    openAlertPopup,
    openModalRewards,
    openModalLevelup,
  } = useContext(PopupContext);
  const { finances, level, updateFinances, updateLevel } =
    useContext(UserContext);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  useEffect(() => {
    if (installment !== null) {
      setPaymentValue(installment.value.toString());
    } else {
      setPaymentValue("");
    }
  }, [installment]);

  async function handleBillPay() {
    const { ok, message } = handleValidations();
    if (ok === false) {
      return openAlertPopup({
        content: message,
      });
    }
    if (parseFloat(paymentValue) !== installment?.value) {
      openConfirmPopUp({
        title: "Atenção",
        content:
          "Você informou um valor diferente do cadastrado na conta, deseja prosseguir mesmo assim?",
        onConfirm: () => {
          payBill();
        },
      });
    } else {
      payBill();
    }
  }

  async function payBill() {
    try {
      setIsPaying(true);
      const {
        data: { rewards, userFinance, userLevel },
      } = await backendApi.put<PayInstallmentType>("/bill/installment/pay", {
        installmentKey: installment?.installmentId,
        balanceType: paymentMethod,
        paidValue: parseFloat(paymentValue),
      });
      const levelUp = userLevel.currentLevel > level.currentLevel;
      selectorRef.current?.removeInstallment(
        installment?.installmentId as number
      );
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
      openAlertPopup({
        content:
          "Não foi possível realizar o pagamento da conta, tente novamente mais tarde",
      });
    } finally {
      setIsPaying(false);
    }
  }

  function handleValidations() {
    const floatPaymentValue = parseFloat(paymentValue);
    if (installment === null) {
      return {
        ok: false,
        message: "Por favor, selecione uma conta para realizar o pagamento",
      };
    }
    if (floatPaymentValue <= 0) {
      return { ok: false, message: "O valor pago deve ser superior a zero" };
    }
    if (paymentMethod === "EC" && finances.currentSavings < floatPaymentValue) {
      return {
        ok: false,
        message: "Economias insuficientes para realizar o pagamento da conta",
      };
    }
    if (paymentMethod === "SA" && finances.balance < floatPaymentValue) {
      return {
        ok: false,
        message: "Saldo insuficiente para realizar o pagamento da conta",
      };
    }
    return { ok: true, message: "" };
  }

  function clearData() {
    setInstallment(null);
    setPaymentValue("");
  }

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <InstallmentSelector
          selectedInstallment={installment}
          setInstallment={setInstallment}
          ref={selectorRef}
        />
        <CustomInput.Container>
          <CustomInput.Icon iconName="attach-money" />
          <CustomInput.Input
            keyboardType="number-pad"
            placeholder="Valor pago"
            value={paymentValue}
            onChangeText={(text) => setPaymentValue(moneyMask(text))}
          />
        </CustomInput.Container>
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <CustomButton
          text="Pagar conta"
          onPress={handleBillPay}
          loading={isPaying}
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

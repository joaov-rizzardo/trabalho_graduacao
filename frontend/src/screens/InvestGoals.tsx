import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import GoalSelector, { GoalSelectorRef } from "../components/GoalSelector";
import { useContext, useRef, useState } from "react";
import { GetGoalType, InvestGoalType } from "../types/ApiResponses/GoalTypes";
import CustomInput from "../components/CustomInput";
import { moneyMask } from "../Utils/Mask";
import CustomButton from "../components/CustomButton";
import { colors } from "../configs/Theme";
import { UserContext } from "../contexts/UserContext";
import { PopupContext } from "../contexts/PopupContext";
import { backendApi } from "../configs/Api";

export default function InvestGoals() {
  const goalSelectorRef = useRef<null | GoalSelectorRef>(null);
  const [goal, setGoal] = useState<GetGoalType | null>(null);
  const [investmentValue, setInvestmentValue] = useState<string>("");
  const { finances, updateFinances, updateLevel, level } =
    useContext(UserContext);
  const { openAlertPopup, openModalRewards, openModalLevelup } =
    useContext(PopupContext);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);

  async function handleInvestGoal() {
    const { ok, message } = handleValidations();
    if (ok === false) {
      return openAlertPopup({
        content: message,
      });
    }
    const {
      data: { rewards, userFinance, userLevel, goal: updatedGoal },
    } = await backendApi.put<InvestGoalType>("/goal/invest", {
      goalId: goal?.goalId,
      value: parseFloat(investmentValue),
    });
    const levelUp = userLevel.currentLevel > level.currentLevel;
    goalSelectorRef.current?.updateGoal(updatedGoal);
    setGoal(updatedGoal);
    setInvestmentValue("0");
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
  }

  function handleValidations() {
    const floatValue = parseFloat(investmentValue);
    if (goal === null) {
      return {
        ok: false,
        message: "Por favor, selecione uma meta para realizar o investimento",
      };
    }
    if (floatValue <= 0) {
      return {
        ok: false,
        message: "O valor de investimento deve ser superior a zero",
      };
    }
    if (floatValue > goal.value - goal.progressValue) {
      return {
        ok: false,
        message:
          "O valor informado é maior do que a quantia pendente para a meta",
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
        <GoalSelector
          selectedGoal={goal}
          setGoal={setGoal}
          ref={goalSelectorRef}
        />
        <View style={styles.badgesContainer}>
          <View style={styles.badgeItem}>
            <Image
              style={styles.badgeImage}
              source={require("../../assets/images/dinheiro.png")}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.badgeTitle}>Valor restante</Text>
              <Text style={styles.badgeValue}>
                {(goal !== null
                  ? goal?.value - goal?.progressValue
                  : 0
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
          </View>
          <View style={styles.badgeItem}>
            <Image
              style={styles.badgeImage}
              source={require("../../assets/images/moedas.png")}
            />
            <View style={styles.badgeTextContainer}>
              <Text style={styles.badgeTitle}>Saldo restante</Text>
              <Text style={styles.badgeValue}>
                {finances.balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
          </View>
        </View>
        <CustomInput.Container>
          <CustomInput.Icon iconName="attach-money" />
          <CustomInput.Input
            placeholder="Valor"
            value={investmentValue}
            onChangeText={(text) => {
              if (goal === null) {
                setInvestmentValue(moneyMask(text));
              } else {
                const maskedValue = moneyMask(text);
                const floatValue = parseFloat(maskedValue);
                const pendingValue = goal.value - goal.progressValue;
                setInvestmentValue(
                  floatValue > pendingValue
                    ? pendingValue.toString()
                    : maskedValue
                );
              }
            }}
          />
        </CustomInput.Container>
        <CustomButton
          text="Realizar investimento"
          onPress={async () => {
            setIsInvesting(true);
            await handleInvestGoal();
            setIsInvesting(false);
          }}
          loading={isInvesting}
        />
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
  badgesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeItem: {
    flexDirection: "row",
    gap: 8,
  },
  badgeImage: {
    width: 36,
    height: 36,
  },
  badgeTextContainer: {
    justifyContent: "space-between",
  },
  badgeTitle: {
    fontFamily: "ComicNeue_400Regular",
    color: colors.text,
    fontSize: 12,
  },
  badgeValue: {
    fontFamily: "ComicNeue_400Regular",
    color: colors.highlight,
    fontSize: 20,
  },
});

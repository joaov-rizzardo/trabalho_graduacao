import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import { useContext, useEffect, useState } from "react";
import { backendApi } from "../configs/Api";
import { colors } from "../configs/Theme";
import IconButton from "../components/IconButton";
import { PopupContext } from "../contexts/PopupContext";
import { CancelGoalType, GetGoalType } from "../types/ApiResponses/GoalTypes";
import RecoverInvestments from "../components/RecoverInvestments";
import { UserContext } from "../contexts/UserContext";

async function findGoals() {
  try {
    const { data: goals } = await backendApi.get<GetGoalType[]>("/goal/get");
    return goals.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

export default function ManageGoals() {
  const [search, setSearch] = useState<string>("");
  const [isOpenRecoveryModal, setIsOpenRecoveryModal] =
    useState<boolean>(false);
  const [recoveringGoal, setRecoveringGoal] = useState<GetGoalType | null>(
    null
  );
  const [goals, setGoals] = useState<GetGoalType[]>([]);
  const { openAlertPopup, openConfirmPopUp } = useContext(PopupContext);
  const { updateFinances } = useContext(UserContext);

  useEffect(() => {
    findGoals().then((findedGoals) =>
      setGoals(findedGoals.filter((goal) => goal.isCompleted === false))
    );
  }, []);

  async function handleCancelGoal(goalId: number) {
    try {
      const {
        data: { userFinance },
      } = await backendApi.put<CancelGoalType>(`goal/cancel/${goalId}`);
      updateFinances(userFinance);
      setGoals(goals.filter((goal) => goal.goalId !== goalId));
      return openAlertPopup({
        title: "Atenção",
        content: "A meta foi cancelada com sucesso.",
      });
    } catch (error: any) {
      console.log(error);
      return openAlertPopup({
        title: "Atenção",
        content:
          "Não foi possível cancelar a meta, tente novamente mais tarde.",
      });
    }
  }

  return (
    <>
      {recoveringGoal !== null && (
        <RecoverInvestments
          visible={isOpenRecoveryModal}
          closeModal={() => setIsOpenRecoveryModal(false)}
          goal={recoveringGoal}
          onSave={(goal) => {
            openAlertPopup({
              title: "Sucesso",
              content: "Seus investimentos foram recuperados com sucesso.",
            });
            setGoals(
              goals.map((currentGoal) => {
                return goal.goalId === currentGoal.goalId ? goal : currentGoal;
              })
            );
          }}
        />
      )}

      <ScreenTemplate>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <CustomInput.Container>
            <CustomInput.Icon iconName="search" />
            <CustomInput.Input
              placeholder="Buscar categoria"
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
          </CustomInput.Container>
          {goals.flatMap((goal, index) => {
            if (
              search !== "" &&
              !goal.description.toLowerCase().includes(search.toLowerCase())
            ) {
              return false;
            }
            return (
              <View style={styles.itemContainer} key={index}>
                <Image
                  source={require("../../assets/images/alvo.png")}
                  style={styles.itemImage}
                />
                <View
                  style={{
                    flex: 1,
                    height: 36,
                    justifyContent: "space-between",
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{ ...styles.text, fontSize: 12, color: colors.text }}
                  >
                    {goal.description}
                  </Text>
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 16,
                      color: colors.mainColor,
                    }}
                  >
                    {goal.value?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
                <View style={{ alignSelf: "flex-end" }}>
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 16,
                      color: colors.highlight,
                    }}
                  >
                    {goal.progressValue?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <IconButton
                    onPress={() => {
                      setRecoveringGoal(goal);
                      setIsOpenRecoveryModal(true);
                    }}
                    style={{ alignSelf: "flex-end" }}
                    icon="attach-money"
                    size={28}
                    color={colors.mainColor}
                  />
                  <IconButton
                    onPress={() => {
                      openConfirmPopUp({
                        title: "Atenção",
                        content:
                          "Você tem certeza que deseja cancelar a meta? Essa ação é irreversível",
                        onConfirm: () => handleCancelGoal(goal.goalId),
                      });
                    }}
                    style={{ alignSelf: "flex-end" }}
                    icon="delete"
                    size={28}
                    color={colors.mainColor}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ScreenTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  itemContainer: {
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: colors.sections,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  itemImage: {
    width: 36,
    height: 36,
    alignSelf: "center",
  },
  text: {
    fontFamily: "ComicNeue_400Regular",
  },
});

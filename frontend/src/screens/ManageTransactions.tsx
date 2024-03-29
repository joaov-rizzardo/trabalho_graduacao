import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import { useContext, useEffect, useState } from "react";
import { backendApi } from "../configs/Api";
import { colors } from "../configs/Theme";
import IconButton from "../components/IconButton";
import {
  EarningCategoryEnum,
  EarningCategoryImages,
  SpendingCategoryEnum,
  SpendingCategoryImages,
} from "../types/CategoryTypes";
import {
  dateDiferenceInDays,
  getThirtyDaysIntervalDateString,
} from "../Utils/DateUtils";
import {
  CancelEarningType,
  CancelSpendingType,
  GetEarnings,
  GetSpendings,
} from "../types/ApiResponses/TransactionTypes";
import { PopupContext } from "../contexts/PopupContext";
import { UserContext } from "../contexts/UserContext";

export type TransactionType = {
  id: number;
  type: "S" | "E";
  categoryKey:
    | keyof typeof EarningCategoryEnum
    | keyof typeof SpendingCategoryEnum;
  categoryDescription: EarningCategoryEnum | SpendingCategoryEnum;
  image: ImageSourcePropType;
  date: Date;
  description: string;
  value: number;
};

async function findLastSpendings() {
  try {
    const { startDate, endDate } = getThirtyDaysIntervalDateString();
    const { data: spendingData } = await backendApi.post<GetSpendings[]>(
      "/transaction/spending/get",
      {
        startDate: startDate,
        finishDate: endDate,
      }
    );
    return spendingData.filter((spending) => spending.isCanceled === false);
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

async function findLastEarnings() {
  try {
    const { startDate, endDate } = getThirtyDaysIntervalDateString();
    const { data: earningData } = await backendApi.post<GetEarnings[]>(
      "/transaction/earning/get",
      {
        startDate: startDate,
        finishDate: endDate,
      }
    );
    return earningData.filter((earning) => earning.isCanceled === false);
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

function groupTransactions({
  spendings,
  earnings,
}: {
  spendings: GetSpendings[];
  earnings: GetEarnings[];
}) {
  const transactionList: TransactionType[] = [];
  spendings.forEach((spending) => {
    transactionList.push({
      id: spending.spendingId,
      categoryKey: spending.categoryKey,
      categoryDescription: spending.categoryDescription,
      image: SpendingCategoryImages[spending.categoryKey],
      date: new Date(spending.spentAt),
      description: spending.description,
      value: spending.value,
      type: "S",
    });
  });
  earnings.forEach((earning) => {
    transactionList.push({
      id: earning.earningId,
      categoryKey: earning.categoryKey,
      categoryDescription: earning.categoryDescription,
      image: EarningCategoryImages[earning.categoryKey],
      date: new Date(earning.earnedAt),
      description: earning.description,
      value: earning.value,
      type: "E",
    });
  });
  transactionList.sort((a, b) => b.date.getTime() - a.date.getTime());
  return transactionList;
}

export default function ManageTransactions() {
  const [search, setSearch] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const { openAlertPopup, openConfirmPopUp } = useContext(PopupContext);
  const { finances, updateFinances } = useContext(UserContext);

  useEffect(() => {
    const getTransactions = async () => {
      const [lastSpendings, lastEarnings] = await Promise.all([
        findLastSpendings(),
        findLastEarnings(),
      ]);
      setTransactions(
        groupTransactions({ spendings: lastSpendings, earnings: lastEarnings })
      );
    };
    getTransactions();
  }, []);

  async function handleCancelTransaction(id: number, type: "E" | "S") {
    try {
      const validationResponse = handleValidations(id, type);
      if (validationResponse.ok === false) {
        return openAlertPopup({
          title: "Atenção",
          content: validationResponse.message,
        });
      }
      const userFinance =
        type === "S" ? await cancelSpending(id) : await cancelEarning(id);
      updateFinances(userFinance);
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.id !== id || transaction.type !== type
        )
      );
      openAlertPopup({
        title: "Atenção",
        content: "A meta foi cancelada com êxito.",
      });
    } catch (error) {
      console.log(error);
      openAlertPopup({
        title: "Atenção",
        content:
          "Não foi possível cancelar a transação, tente novamente mais tarde.",
      });
    }
  }

  async function cancelSpending(id: number) {
    const {
      data: { userFinance },
    } = await backendApi.put<CancelSpendingType>(
      `/transaction/spending/cancel/${id}`
    );
    return userFinance;
  }

  async function cancelEarning(id: number) {
    const {
      data: { userFinance },
    } = await backendApi.put<CancelEarningType>(
      `/transaction/earning/cancel/${id}`
    );
    return userFinance;
  }

  function handleValidations(id: number, type: "E" | "S") {
    const element = transactions.find(
      (transaction) => transaction.id === id && transaction.type === type
    );
    if (!element) {
      return {
        ok: false,
        message: "Não foi possível cancelar a meta, tente novamente mais tarde",
      };
    }
    if (type === "E") {
      if (element.value > finances.balance) {
        return {
          ok: false,
          message:
            "Você não possuí saldo o suficiente para realizar essa operação",
        };
      }
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
          <CustomInput.Icon iconName="search" />
          <CustomInput.Input
            placeholder="Buscar categoria"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </CustomInput.Container>
        {transactions.flatMap((transaction, index) => {
          if (
            search !== "" &&
            !transaction.description
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            return false;
          }
          return (
            <View style={styles.itemContainer} key={index}>
              <Image source={transaction.image} style={styles.itemImage} />
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
                  {transaction.description}
                </Text>
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 16,
                    color: colors.mainColor,
                  }}
                >
                  {transaction.categoryDescription}
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
                  {transaction.value?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
              {dateDiferenceInDays(transaction.date, new Date()) < 1 && (
                <IconButton
                  onPress={() => {
                    openConfirmPopUp({
                      title: "Atenção",
                      content:
                        "Você tem certeza que deseja cancelar a transação? Essa ação é irreversível",
                      onConfirm: () =>
                        handleCancelTransaction(
                          transaction.id,
                          transaction.type
                        ),
                    });
                  }}
                  style={{ alignSelf: "flex-end" }}
                  icon="delete"
                  size={28}
                  color={colors.mainColor}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </ScreenTemplate>
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

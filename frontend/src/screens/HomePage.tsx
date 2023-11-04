import { useContext, useEffect, useState } from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { AuthContext } from "../contexts/AuthContext";
import { StackActions } from "@react-navigation/native";
import DataBox from "../components/DataBox";
import HomepageCard from "../components/HomepageCard";
import LevelBar from "../components/LevelBar";
import OptionSelector from "../components/OptionSelector";
import MovementCard from "../components/MovementCard";
import ActivityCard from "../components/ActivityCard";
import { ActivityType } from "../types/ActivityType";
import {
  EarningCategoryEnum,
  EarningCategoryImages,
  SpendingCategoryEnum,
  SpendingCategoryImages,
} from "../types/CategoryTypes";
import { backendApi } from "../configs/Api";
import {
  GetEarnings,
  GetLastActivities,
  GetSpendings,
} from "../types/ApiResponses/TransactionTypes";
import { getThirtyDaysIntervalDateString } from "../Utils/DateUtils";
import { UserContext } from "../contexts/UserContext";
import { GetInstallmentsType } from "../types/ApiResponses/BillTypes";
interface HomePageProps {
  navigation: StackNavigationProp<AuthStackNavigationType, "EmailValidation">;
}

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

async function findLastActivities() {
  try {
    const { data: lastActivities } = await backendApi.get<GetLastActivities[]>(
      "/transaction/lastActivities"
    );
    return lastActivities;
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

async function findLastPaidInstallments() {
  try {
    const { startDate, endDate } = getThirtyDaysIntervalDateString();
    const { data: installmentData } = await backendApi.post<
      GetInstallmentsType[]
    >("/bill/getInstallments", {
      startDate: startDate,
      finishDate: endDate,
      payed: true,
    });
    return installmentData;
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

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

function groupTransactions({
  spendings,
  earnings,
  installments,
}: {
  spendings: GetSpendings[];
  earnings: GetEarnings[];
  installments: GetInstallmentsType[];
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
  installments.forEach((installment) => ({
    id: installment.installmentId,
    categoryKey: installment.categoryKey,
    categoryDescription: installment.categoryDescription,
    image: SpendingCategoryImages[installment.categoryKey],
    date: new Date(installment.payedAt),
    description: installment.description,
    value: installment.value,
    type: "S",
  }));
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

export default function HomePage({ navigation }: HomePageProps) {
  const { user, token } = useContext(AuthContext);
  const { level, finances } = useContext(UserContext);
  const [showType, setShowType] = useState<"M" | "A">("M");
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    if (user.isValidatedEmail === false) {
      navigation.dispatch(StackActions.replace("EmailValidation"));
    }
  }, [user]);

  useEffect(() => {
    const getHomePageData = async () => {
      const [lastActivities, lastSpendings, lastEarnings, lastInstallments] =
        await Promise.all([
          findLastActivities(),
          findLastSpendings(),
          findLastEarnings(),
          findLastPaidInstallments(),
        ]);
      setActivities(lastActivities);
      setTransactions(
        groupTransactions({
          spendings: lastSpendings,
          earnings: lastEarnings,
          installments: lastInstallments,
        })
      );
    };
    if (backendApi.defaults.headers.common["Authorization"] !== "") {
      getHomePageData();
    }
  }, [token]);

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <LevelBar />
        <DataBox style={{ flexDirection: "row" }}>
          <HomepageCard
            title="Pontuação"
            value={level.points}
            image={require("../../assets/images/velocimetro.png")}
          />
          <HomepageCard
            title="Total economizado"
            value={finances.totalSavings?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            image={require("../../assets/images/crescimento.png")}
          />
        </DataBox>
        <DataBox style={{ flexDirection: "row" }}>
          <HomepageCard
            title="Economias"
            value={finances.currentSavings?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            image={require("../../assets/images/cofrinho.png")}
          />
          <HomepageCard
            title="Saldo"
            value={finances.balance?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            image={require("../../assets/images/moedas.png")}
          />
        </DataBox>
        <OptionSelector
          options={[
            {
              value: "M",
              description: "Movimentações",
            },
            {
              value: "A",
              description: "Atividades",
            },
          ]}
          value={showType}
          setValue={setShowType}
        />
        <View style={styles.cardList}>
          {showType === "M"
            ? transactions.map((transaction, index) => (
                <MovementCard transaction={transaction} key={index} />
              ))
            : activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))}
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  cardList: {
    gap: 16,
  },
});

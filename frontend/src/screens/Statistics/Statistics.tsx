
import { useState } from 'react'
import { View, ScrollView, StyleSheet } from "react-native";
import ScreenTemplate from "../../components/ScreenTemplate";
import ChartSelector from "./components/ChartSelector";
import { Gauge } from '../../components/Gauge';
import EarningByCategoryChart from './components/EarningByCategoryChart';
import SpendingByCategoryChart from './components/SpendingByCategoryChart';
import EarningsXSpendingsChart from './components/EarningsXSpendingsChart';

export default function Statistics() {
  const [selectedChartType, setSelectedChartType] = useState<'earning_category' | 'spending_category' | 'earning_x_spending'>('spending_category')
  const [interval, setInterval] = useState<number>(30)
  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.selectorContainer}>
          <ChartSelector
            onPress={() => setSelectedChartType("spending_category")}
            active={selectedChartType === "spending_category"}
            label="Gastos por categoria"
            image={require('../../../assets/images/despesas.png')}
          />
          <ChartSelector
            onPress={() => setSelectedChartType("earning_category")}
            active={selectedChartType === "earning_category"}
            label="Ganhos por categoria"
            image={require('../../../assets/images/ganho.png')}
          />
          <ChartSelector
            onPress={() => setSelectedChartType("earning_x_spending")}
            active={selectedChartType === "earning_x_spending"}
            label="Ganhos x Gastos"
            image={require('../../../assets/images/financa.png')}
          />
        </View>
        <View style={styles.gaugesContainer}>
          <Gauge 
            isOutline={interval !== 30}
            onPress={() => setInterval(30)}
            text='Últimos 30 dias'
          />
          <Gauge 
            isOutline={interval !== 90}
            onPress={() => setInterval(90)}
            text='Últimos 90 dias'
          />
        </View>
        {selectedChartType === "earning_category" && (
          <EarningByCategoryChart interval={interval}/>
        )}
        {selectedChartType === "spending_category" && (
          <SpendingByCategoryChart interval={interval}/>
        )}
        {selectedChartType === "earning_x_spending" && (
          <EarningsXSpendingsChart interval={interval}/>
        )}
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 28
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  gaugesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20
  }
})
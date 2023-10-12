
import { Text, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { colors } from "../configs/Theme";
import { ProgressChartData } from "react-native-chart-kit/dist/ProgressChart";
export default function Statistics() {
  const data: ProgressChartData = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8],
    colors: ['#000', "#fff"]
  };
  return (
    <ScreenTemplate>
      <ProgressChart
        data={data}
        width={330}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundColor: "#000",
          
          backgroundGradientFrom: colors.highlight,
          backgroundGradientTo: colors.highlight,
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: colors.highlight
          }
        }}
        hideLegend={false}
      />
    </ScreenTemplate>


  )
}
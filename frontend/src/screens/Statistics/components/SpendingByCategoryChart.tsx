import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageSourcePropType } from 'react-native'
import PieChart from 'react-native-pie-chart'
import { colors } from '../../../configs/Theme';
import ChartLegend from './ChartLegend';
import { backendApi } from '../../../configs/Api';
import { GetSpendingByCategoryType } from '../../../types/ApiResponses/ManagementTypes';
import { getDatesByInterval } from '../../../Utils/DateUtils';
import { SpendingCategoryEnum, SpendingCategoryImages } from '../../../types/CategoryTypes';
import { generateUniqueRandomColors } from '../../../Utils/GenerateColors';
import CategoryCard from './CategoryCard';

interface SpendingByCategoryChartProps {
    interval: number
}

async function findSpendingsByCategory(startsAt: string, endsAt: string) {
    try {
        const { data: spendings } = await backendApi.post<GetSpendingByCategoryType[]>('/management/spendingsByCategory', {
            startDate: startsAt,
            finishDate: endsAt
        })
        return spendings
    } catch (error: any) {
        console.log(error)
        return []
    }
}

type SpendingByCategory = {
    value: number
    color: string
    categoryKey: keyof typeof SpendingCategoryEnum
    categoryDescription: SpendingCategoryEnum
    image: ImageSourcePropType
}

export default function SpendingByCategoryChart({ interval }: SpendingByCategoryChartProps) {
    const [spendings, setSpendings] = useState<SpendingByCategory[]>([])
    useEffect(() => {
        const { startsAt, endsAt } = getDatesByInterval(interval)
        findSpendingsByCategory(startsAt, endsAt).then(findedSpendings => {
            const randomColors = generateUniqueRandomColors(findedSpendings.length)
            setSpendings(findedSpendings.map((spending, index) => ({
                value: spending.value,
                color: randomColors[index],
                categoryDescription: spending.categoryDescription,
                categoryKey: spending.categoryKey,
                image: SpendingCategoryImages[spending.categoryKey]
            })))
        })
    }, [interval])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos por categoria</Text>
            <View style={styles.legendsContainer}>
                {spendings.map((spending, index) => (
                    <ChartLegend key={index} color={spending.color} label={spending.categoryDescription} />
                ))}
            </View>
            {spendings.length > 0 && (
                <PieChart
                    widthAndHeight={150}
                    series={spendings.map(({ value }) => value)}
                    sliceColor={spendings.map(({ color }) => color)}
                    coverRadius={0.45}
                />
            )}
            {spendings.map((spending, index) => (
                <CategoryCard key={index} label={spending.categoryDescription} image={spending.image} value={spending.value}/>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        alignItems: 'center'
    },
    title: {
        fontFamily: 'ComicNeue_700Bold',
        fontSize: 24,
        textAlign: 'center',
        color: colors.mainColor
    },
    legendsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap'
    }
})
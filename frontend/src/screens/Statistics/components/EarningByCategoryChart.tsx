import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageSourcePropType } from 'react-native'
import PieChart from 'react-native-pie-chart'
import { colors } from '../../../configs/Theme';
import ChartLegend from './ChartLegend';
import { backendApi } from '../../../configs/Api';
import { GetEarningByCategoryType } from '../../../types/ApiResponses/ManagementTypes';
import { getDatesByInterval } from '../../../Utils/DateUtils';
import { EarningCategoryEnum, EarningCategoryImages } from '../../../types/CategoryTypes';
import { generateUniqueRandomColors } from '../../../Utils/GenerateColors';
import CategoryCard from './CategoryCard';

async function findEarningsByCategory(startsAt: string, endsAt: string) {
    try {
        const { data: earnings } = await backendApi.post<GetEarningByCategoryType[]>('/management/earningsByCategory', {
            startDate: startsAt,
            finishDate: endsAt
        })
        return earnings
    } catch (error: any) {
        console.log(error)
        return []
    }
}

interface EarningByCategoryChartProps {
    interval: number
}

type EarningByCategory = {
    value: number
    color: string
    categoryKey: keyof typeof EarningCategoryEnum
    categoryDescription: EarningCategoryEnum
    image: ImageSourcePropType
}

export default function EarningByCategoryChart({ interval }: EarningByCategoryChartProps) {
    const [earnings, setEarnings] = useState<EarningByCategory[]>([])
    useEffect(() => {
        const { startsAt, endsAt } = getDatesByInterval(interval)
        findEarningsByCategory(startsAt, endsAt).then(findedEarnings => {
            const randomColors = generateUniqueRandomColors(findedEarnings.length)
            setEarnings(findedEarnings.map((earning, index) => ({
                value: earning.value,
                color: randomColors[index],
                categoryDescription: earning.categoryDescription,
                categoryKey: earning.categoryKey,
                image: EarningCategoryImages[earning.categoryKey]
            })))
        })
    }, [interval])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ganhos por categoria</Text>
            <View style={styles.legendsContainer}>
                {earnings.map((earning, index) => (
                    <ChartLegend key={index} color={earning.color} label={earning.categoryDescription} />
                ))}
            </View>
            {earnings.length > 0 && (
                <PieChart
                    widthAndHeight={150}
                    series={earnings.map(({ value }) => value)}
                    sliceColor={earnings.map(({ color }) => color)}
                    coverRadius={0.45}
                />
            )}
            {earnings.map((earning, index) => (
                <CategoryCard key={index} label={earning.categoryDescription} image={earning.image} value={earning.value}/>
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
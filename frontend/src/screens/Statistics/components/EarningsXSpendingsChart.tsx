import { StyleSheet, View, Text, ImageSourcePropType } from 'react-native'
import { colors } from '../../../configs/Theme'
import ChartLegend from './ChartLegend'
import { backendApi } from '../../../configs/Api'
import { GetTransactionsType } from '../../../types/ApiResponses/ManagementTypes'
import { useState, useEffect, useMemo } from 'react'
import { getDatesByInterval } from '../../../Utils/DateUtils'
import { LineChart } from 'react-native-chart-kit'
import { EarningCategoryEnum, EarningCategoryImages, SpendingCategoryEnum, SpendingCategoryImages } from '../../../types/CategoryTypes'
import TransactionCard from './TransactionCard'

async function findTransactions(startsAt: string, endsAt: string) {
    try {
        const { data: transactions } = await backendApi.post<GetTransactionsType>('/management/getTransactions', {
            startDate: startsAt,
            finishDate: endsAt
        })
        return transactions
    } catch (error: any) {
        console.log(error)
        return null
    }
}

async function handleSearchTransactions(interval: number) {
    const { startsAt, endsAt } = getDatesByInterval(interval)
    const transactions = await findTransactions(startsAt, endsAt)
    if (transactions === null) {
        return null
    }
    return transactions
}

function acumulateTransactions({ spendings, earnings }: GetTransactionsType) {
    spendings.sort((a, b) => (new Date(a.spendingDate)).getTime() - (new Date(b.spendingDate)).getTime())
    earnings.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime())
    let acumulatedEarning = 0
    let acumulatedSpending = 0
    const acumulatedTransactions = {
        earnings: earnings.map(earning => {
            acumulatedEarning += earning.value
            return { date: earning.date, value: acumulatedEarning }
        }),
        spendings: spendings.map(spending => {
            acumulatedSpending += spending.value
            return { date: spending.spendingDate, value: acumulatedSpending }
        })
    }
    const dates = [
        ...acumulatedTransactions.earnings.map(earning => earning.date),
        ...acumulatedTransactions.spendings.map(spending => spending.date)
    ]
    dates.sort((a, b) => (new Date(a)).getTime() - (new Date(b)).getTime())
    return {
        earnings: fillTransactionList(dates, acumulatedTransactions.earnings),
        spendings: fillTransactionList(dates, acumulatedTransactions.spendings)
    }
}

function fillTransactionList(dates: string[], earningList: {
    value: number;
    date: string;
}[]) {
    const result = []
    let lastValue = null;
    let index = 0;
    for (const date of dates) {
        if (earningList[index] && date === earningList[index].date) {
            result.push(earningList[index]);
            lastValue = earningList[index].value;
            index++;
        } else {
            result.push({ date: date, value: lastValue !== null ? lastValue : 0 });
        }
    }
    return result
}

function getSignificantDatesIndex(length: number, desiredCount: number) {
    const count = Math.min(desiredCount, length)
    const selectedIndex = []
    const interval = Math.ceil(length / count)
    for (let i = 0; i < count; i++) {
        selectedIndex.push(i * interval)
    }
    return selectedIndex
}

type transactionToDisplayType = {
    categoryDescription: string
    value: number
    image: ImageSourcePropType
    type: 'S' | 'E'
    date: Date
}

interface EarningsXSpendingsChartProps {
    interval: number
}

export default function EarningsXSpendingsChart({ interval }: EarningsXSpendingsChartProps) {
    const [transactions, setTransactions] = useState<GetTransactionsType | null>(null)

    useEffect(() => {
        handleSearchTransactions(interval).then(transations => {
            setTransactions(transations)
        })
    }, [interval])

    const acumulatedTransactions = useMemo(() => {
        return transactions !== null ? acumulateTransactions(transactions) : null
    }, [transactions])

    const transactionToDisplay: transactionToDisplayType[] = useMemo(() => {
        if (transactions === null) {
            return []
        }
        const groupedTransactions = [
            ...transactions.earnings.map(earning => ({
                categoryDescription: EarningCategoryEnum[earning.category],
                value: earning.value,
                image: EarningCategoryImages[earning.category],
                type: 'E',
                date: new Date(earning.date)
            })),
            ...transactions.spendings.map(spending => ({
                categoryDescription: SpendingCategoryEnum[spending.category],
                value: spending.value,
                image: SpendingCategoryImages[spending.category],
                type: 'S',
                date: new Date(spending.spendingDate)
            }))
        ]
        groupedTransactions.sort((a, b) => a.date.getTime() - b.date.getTime())
        return groupedTransactions as transactionToDisplayType[]
    }, [transactions])

    const transactionsDates = useMemo(() => {
        if (transactions === null) {
            return []
        }
        const dates = [
            ...transactions.earnings.map(earning => new Date(earning.date)),
            ...transactions.spendings.map(spending => new Date(spending.spendingDate))
        ]
        dates.sort((a, b) => a.getTime() - b.getTime())
        const formattedDates = dates.map(date => `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, "0")}`)
        const datesNormalized = Array.from(new Set(formattedDates))
        const indexes = getSignificantDatesIndex(datesNormalized.length, 5)
        return datesNormalized.filter((date, index) => indexes.includes(index))
    }, [transactions])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos versus ganhos</Text>
            <View style={styles.legendsContainer}>
                <ChartLegend color={colors.success} label={"Ganhos"} />
                <ChartLegend color={colors.error} label={"Gastos"} />
            </View>
            {acumulatedTransactions !== null && (
                <LineChart
                    width={330}
                    height={300}
                    data={{
                        labels: transactionsDates,
                        datasets: [
                            {
                                data:
                                    acumulatedTransactions.earnings.map(earning => earning.value),
                                color: () => '#7FD7B2'
                            },
                            {
                                data: acumulatedTransactions.spendings.map(spending => spending.value),
                                color: () => '#D78A7F'
                            }
                        ],
                    }}
                    chartConfig={{
                        backgroundColor: colors.mainColor,
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        barRadius: 10,
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 60,
                            padding: 20
                        },
                        propsForLabels: {
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 200,
                            stroke: colors.text
                        },
                        propsForBackgroundLines: {
                            stroke: colors.text
                        }
                    }}

                />
            )}
            {transactionToDisplay.map((transaction, index) => (
                <TransactionCard
                    key={index}
                    categoryDescription={transaction.categoryDescription}
                    image={transaction.image}
                    type={transaction.type}
                    value={transaction.value}
                />
            ))}
        </View >
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
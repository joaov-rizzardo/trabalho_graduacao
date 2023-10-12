import { useState, useEffect, useMemo, useContext } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import ScreenTemplate from "../components/ScreenTemplate"
import { Gauge } from '../components/Gauge'
import { colors } from "../configs/Theme"
import LevelStar from "../components/LevelStar"
import { GetLevelRanking, GetPointsRanking, LevelRankingMemberType, PointRankingMemberType } from "../types/ApiResponses/ManagementTypes";
import { apiURL, backendApi } from "../configs/Api";
import { AuthContext } from "../contexts/AuthContext";

export async function findLevelRanking() {
    try {
        const { data: levelRanking } = await backendApi.get<GetLevelRanking>('/management/levelRanking')
        return levelRanking
    } catch (error: any) {
        console.log(error)
        return {} as GetLevelRanking
    }
}

export async function findPointsRankings() {
    try {
        const { data: pointRanking } = await backendApi.get<GetPointsRanking>('/management/pointsRanking')
        return pointRanking
    } catch (error: any) {
        console.log(error)
        return {} as GetPointsRanking
    }
}

export default function Rankings() {
    const [pointsRanking, setPointsRanking] = useState<GetPointsRanking | null>(null)
    const [levelRanking, setLevelRanking] = useState<GetLevelRanking | null>(null)
    const [rankingType, setRankingType] = useState<'level' | 'points'>('level')
    const [divisionType, setDivisionType] = useState<'top' | 'my'>('my')
    const {user} = useContext(AuthContext)

    useEffect(() => {
        Promise.all([
            findLevelRanking(),
            findPointsRankings()
        ]).then(([levelData, pointData]) => {
            setLevelRanking(levelData)
            setPointsRanking(pointData)
        })
    }, [])

    const currentRankings = useMemo(() => {
        if (rankingType === "level" && levelRanking !== null) {
            const ranking = divisionType === "my" ? levelRanking.userRanking : levelRanking.topRanking
            return {
                division: ranking.division,
                ranking: ranking.ranking.map(ranking => ({ ...ranking, points: 0 }))
            }
        } else if (rankingType === "points" && pointsRanking !== null) {
            const ranking = divisionType === "my" ? pointsRanking.userRanking : pointsRanking.topRanking
            return {
                division: ranking.division,
                ranking: ranking.ranking.map(ranking => ({ ...ranking, currentLevel: 0 }))
            }
        }
        return {
            division: 1,
            ranking: []
        }
    }, [pointsRanking, levelRanking, rankingType, divisionType])

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={{ gap: 12 }}>
                    <View style={{ gap: 12, flexDirection: 'row' }}>
                        <Gauge
                            text="Level"
                            isOutline={rankingType !== 'level'}
                            onPress={() => setRankingType('level')}
                            image={require('../../assets/images/subir-de-nivel.png')}
                        />
                        <Gauge
                            text="Pontos"
                            isOutline={rankingType !== 'points'}
                            onPress={() => setRankingType('points')}
                            image={require('../../assets/images/velocimetro.png')}
                        />
                    </View>
                    <View style={{ gap: 12, flexDirection: 'row' }}>
                        <Gauge
                            text="Meu ranking"
                            isOutline={divisionType !== "my"}
                            onPress={() => setDivisionType("my")}
                            image={require('../../assets/images/avatar-de-perfil.png')}
                        />
                        <Gauge
                            text="Top ranking"
                            isOutline={divisionType !== "top"}
                            onPress={() => setDivisionType("top")}
                            image={require('../../assets/images/podio.png')}
                        />
                    </View>
                </View>
                <Text style={styles.divisionText}>{currentRankings?.division}ª Divisão</Text>
                {currentRankings?.ranking.map((ranking, index) => (
                    <View style={{
                        ...styles.personContainer,
                        backgroundColor: ranking.userId === user.userId ? colors.mainColor : colors.sections,
                    }} key={index}>
                        <Text style={styles.positionText}>{index + 1}ª</Text>
                        <Image style={styles.avatarImage} source={ranking.selectedAvatar ? { uri: `${apiURL}/profile/avatar/${ranking.selectedAvatar}` } : require('../../assets/images/default-picture.jpg')} />
                        <Text style={{
                            ...styles.nameText,
                            color: ranking.userId === user.userId ? colors.secondaryHighlight : colors.text,
                        }}>{ranking.userId === user.userId ? "Você" : ranking.username}</Text>
                        {rankingType === "level" ? (
                            <LevelStar level={ranking?.currentLevel} size={40} />
                        ) : (
                            <Text style={styles.pointsText}>{ranking.points}</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    divisionText: {
        fontFamily: 'ComicNeue_700Bold',
        fontSize: 28,
        textAlign: 'center',
        color: colors.highlight
    },
    personContainer: {
        flexDirection: 'row',
        gap: 12,
        height: 54,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 10
    },
    positionText: {
        fontFamily: 'ComicNeue_700Bold',
        fontSize: 24,
        textAlign: 'center',
        color: colors.secondaryHighlight
    },
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: 36
    },
    nameText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        textAlign: 'center',
        flex: 1
    },
    pointsText: {
        fontFamily: 'ComicNeue_700Bold',
        fontSize: 20,
        textAlign: 'center',
        color: colors.highlight
    }
})
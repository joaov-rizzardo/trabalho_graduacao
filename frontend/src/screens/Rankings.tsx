import { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import ScreenTemplate from "../components/ScreenTemplate"
import { Gauge } from '../components/Gauge'
import { colors } from "../configs/Theme"
import LevelStar from "../components/LevelStar"
import { GetLevelRanking, GetPointsRanking } from "../types/ApiResponses/ManagementTypes";
import { backendApi } from "../configs/Api";

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
    const [pointsRanking, setPointsRanking] = useState<GetPointsRanking>({} as GetPointsRanking)
    const [levelRanking, setLevelRanking] = useState<GetLevelRanking>({} as GetLevelRanking)
    const [rankingType, setRankingType] = useState<'level' | 'points'>('level')
    const [divisionType, setDivisionType] = useState<'top' | 'my'>('my')

    useEffect(() => {
        Promise.all([
            findLevelRanking(),
            findPointsRankings()
        ]).then(([levelData, pointData]) => {
            setLevelRanking(levelData)
            setPointsRanking(pointData)
        })
    }, [])

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
                <Text style={styles.divisionText}>2ª Divisão</Text>
                <View style={{
                    ...styles.personContainer,
                    backgroundColor: true ? colors.mainColor : colors.sections,
                }}>
                    <Text style={styles.positionText}>2ª</Text>
                    <Image style={styles.avatarImage} source={require('../../assets/images/avatar-de-perfil.png')} />
                    <Text style={{
                        ...styles.nameText,
                        color: true ? colors.secondaryHighlight : colors.text,
                    }}>Marcos</Text>
                    <Text style={styles.pointsText}>502</Text>
                </View>
                <View style={{
                    ...styles.personContainer,
                    backgroundColor: false ? colors.mainColor : colors.sections,
                }}>
                    <Text style={styles.positionText}>2ª</Text>
                    <Image style={styles.avatarImage} source={require('../../assets/images/avatar-de-perfil.png')} />
                    <Text style={{
                        ...styles.nameText,
                        color: false ? colors.secondaryHighlight : colors.text,
                    }}>Marcos</Text>
                    <Text style={styles.pointsText}>502</Text>
                </View>
                <View style={{
                    ...styles.personContainer,
                    backgroundColor: false ? colors.mainColor : colors.sections,
                }}>
                    <Text style={styles.positionText}>2ª</Text>
                    <Image style={styles.avatarImage} source={require('../../assets/images/avatar-de-perfil.png')} />
                    <Text style={{
                        ...styles.nameText,
                        color: false ? colors.secondaryHighlight : colors.text,
                    }}>Marcos</Text>
                    <LevelStar level={52} size={40} />
                </View>
                <View style={{
                    ...styles.personContainer,
                    backgroundColor: true ? colors.mainColor : colors.sections,
                }}>
                    <Text style={styles.positionText}>2ª</Text>
                    <Image style={styles.avatarImage} source={require('../../assets/images/avatar-de-perfil.png')} />
                    <Text style={{
                        ...styles.nameText,
                        color: true ? colors.secondaryHighlight : colors.text,
                    }}>Marcos</Text>
                    <LevelStar level={52} size={40} />
                </View>
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
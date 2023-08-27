import { useContext, useEffect } from 'react'
import { ScrollView, StyleSheet, Text } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { AuthContext } from "../contexts/AuthContext";
import { StackActions } from '@react-navigation/native';
import DataBox from '../components/DataBox';
import HomepageCard from '../components/HomepageCard';
import LevelStar from '../components/LevelStar';
import LevelBar from '../components/LevelBar';
interface HomePageProps {
    navigation: StackNavigationProp<AuthStackNavigationType, "EmailValidation">
}

export default function HomePage({ navigation }: HomePageProps) {
    const { user } = useContext(AuthContext)
    useEffect(() => {
        if (user.isValidatedEmail === false) {
            navigation.dispatch(StackActions.replace('EmailValidation'))
        }
    }, [user])
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <LevelBar />
                <DataBox style={{ flexDirection: 'row' }}>
                    <HomepageCard title="Pontuação" value="594" image={require('../../assets/images/velocimetro.png')} />
                    <HomepageCard title="Total economizado" value="R$ 12590,00" image={require('../../assets/images/crescimento.png')} />
                </DataBox>
                <DataBox style={{ flexDirection: 'row' }}>
                    <HomepageCard title="Economias" value="R$ 220,99" image={require('../../assets/images/cofrinho.png')} />
                    <HomepageCard title="Saldo" value="R$ 1500,99" image={require('../../assets/images/moedas.png')} />
                </DataBox>
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    }
})
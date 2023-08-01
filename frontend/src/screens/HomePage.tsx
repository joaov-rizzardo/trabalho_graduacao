import {useContext, useEffect} from 'react'
import { Text } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { AuthContext } from "../contexts/AuthContext";
import { StackActions } from '@react-navigation/native';
interface HomePageProps {
    navigation: StackNavigationProp<AuthStackNavigationType, "EmailValidation">
}
export default function HomePage({navigation}: HomePageProps){
    const {user} = useContext(AuthContext)
    
    useEffect(() => {
        if(user.isValidatedEmail === false){
            navigation.dispatch(StackActions.replace('EmailValidation'))
        }
    }, [user])
    return(
        <ScreenTemplate>
            <Text>HomePage</Text>
        </ScreenTemplate>
    )
}
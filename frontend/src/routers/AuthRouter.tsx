import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import Login from "../screens/Login";
import React, { useContext, useEffect, useState } from "react";
import Register from "../screens/Register";
import EmailValidation from "../screens/EmailValidation";
import HomePage from "../screens/HomePage";
import { AuthContext } from "../contexts/AuthContext";
import ForgetPassword from "../screens/ForgetPassword";
import RecoveryPassword from "../screens/RecoveryPassword";
import MainRouter from "./MainRouter";

export type AuthStackNavigationType = {
    HomePage: undefined
    Login: undefined,
    Register: undefined,
    EmailValidation: undefined,
    ForgetPassword: undefined,
    RecoveryPassword: {userId: number},
}

export default function AuthRouter() {
    const Stack = createStackNavigator<AuthStackNavigationType>()
    const {loginWithToken, authenticated} = useContext(AuthContext)

    useEffect(() => {
        const loadAppInfo = async () => {
            await loginWithToken()
            await new Promise(resolve => setTimeout(resolve, 2000))
            SplashScreen.hideAsync()
        }
        loadAppInfo()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false
                }}
            >
                {authenticated ? (
                    <>
                        <Stack.Screen name="HomePage" component={MainRouter} />
                        <Stack.Screen name="EmailValidation" component={EmailValidation} options={{animationEnabled: false}} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                        <Stack.Screen name="RecoveryPassword" component={RecoveryPassword} initialParams={{userId: 0}}/>
                    </>
                )}  
            </Stack.Navigator>
        </NavigationContainer>
    )
}
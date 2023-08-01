import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import Login from "../screens/Login";
import React from "react";
import Register from "../screens/Register";
import EmailValidation from "../screens/EmailValidation";
import ForgetPassword from "../screens/ForgetPassword";
import RecoveryPassword from "../screens/RecoveryPassword";
import HomePage from "../screens/HomePage";
import { AuthProvider } from "../contexts/AuthContext";

export type AuthStackNavigationType = {
    Login: undefined,
    Register: undefined,
    EmailValidation: undefined,
    ForgetPassword: undefined,
    RecoveryPassword: undefined,
    HomePage: undefined
}

export default function AuthRouter() {
    const Stack = createStackNavigator<AuthStackNavigationType>()
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="EmailValidation" component={EmailValidation} />
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                <Stack.Screen name="RecoveryPassword" component={RecoveryPassword} />
                <Stack.Screen name="HomePage" component={HomePage} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
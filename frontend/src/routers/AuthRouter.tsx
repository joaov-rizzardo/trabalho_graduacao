import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import Login from "../screens/Login";
import React from "react";
import Register from "../screens/Register";
import EmailValidation from "../screens/EmailValidation";
import ForgetPassword from "../screens/ForgetPassword";
import RecoveryPassword from "../screens/RecoveryPassword";

export default function AuthRouter() {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="recovery-password"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="register" component={Register} />
                <Stack.Screen name="email-validation" component={EmailValidation} />
                <Stack.Screen name="forget-password" component={ForgetPassword} />
                <Stack.Screen name="recovery-password" component={RecoveryPassword} />
            </Stack.Navigator>
        </NavigationContainer>

    )
}
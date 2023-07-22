import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import Login from "../screens/Login";
import React from "react";

export default function AuthRouter() {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="login" component={Login} />
            </Stack.Navigator>
        </NavigationContainer>

    )
}
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import Login from "../screens/Login";
import React from "react";
import Register from "../screens/Register";

export default function AuthRouter() {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="register"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="register" component={Register} />
            </Stack.Navigator>
        </NavigationContainer>

    )
}
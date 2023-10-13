import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile/Profile";
import ChangeProfile from "../screens/Profile/ChangeProfile";

export type ProfileStackNavigationType = {
    ProfileMenu: undefined,
    ProfileUpdate: undefined
}

export default function ProfileRouter(){
    const Stack = createStackNavigator<ProfileStackNavigationType>()
    
    return (
        <NavigationContainer
            independent={true}
        >
            <Stack.Navigator
                initialRouteName="ProfileMenu"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="ProfileMenu" component={Profile} />
                <Stack.Screen name="ProfileUpdate" component={ChangeProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
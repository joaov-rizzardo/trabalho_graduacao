import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../screens/HomePage";
import Rankings from "../screens/Rankings";
import Statistics from "../screens/Statistics";
import Profile from "../screens/Profile";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import { UserProvider } from "../contexts/UserContext";
import ActionsRouter from "./ActionsRouter";

export default function MainRouter() {
    const Tab = createBottomTabNavigator()
    return (
        <UserProvider>
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: {
                        fontFamily: 'ComicNeue_400Regular',
                        fontSize: 12
                    },
                    tabBarActiveTintColor: colors.mainColor,
                    tabBarStyle: {
                        height: 80,
                        justifyContent: 'space-between'
                    },
                    headerShown: false
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomePage}
                    options={{
                        tabBarLabel: 'Início',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcon name="home" color={color} size={36} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Rankings"
                    component={Rankings}
                    options={{
                        tabBarLabel: 'Rankings',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcon name="leaderboard" color={color} size={36} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Actions"
                    component={ActionsRouter}
                    options={{
                        tabBarItemStyle: {
                            backgroundColor: colors.mainColor,
                            borderRadius: 100,
                            height: '80%',
                            alignSelf: 'center',
                            flex: 0.8
                        },
                        tabBarLabel: '',
                        tabBarLabelStyle: {
                            display: 'none'
                        },
                        tabBarIcon: () => (
                            <MaterialIcon name="add" color={colors.sections} size={36} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Statistics"
                    component={Statistics}
                    options={{
                        tabBarLabel: 'Estatísticas',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcon name="pie-chart" color={color} size={36} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcon name="person" color={color} size={36} />
                        )
                    }}
                />
            </Tab.Navigator>
        </UserProvider>

    )
}
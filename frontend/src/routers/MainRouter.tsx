import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../screens/HomePage";
import Rankings from "../screens/Rankings";
import Statistics from "../screens/Statistics/Statistics";
import Profile from "../screens/Profile/Profile";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import { UserProvider } from "../contexts/UserContext";
import ActionsRouter from "./ActionsRouter";
import ProfileRouter from "./ProfileRouter";

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
                        unmountOnBlur: true,
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
                        unmountOnBlur: true,
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
                        unmountOnBlur: true,
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
                        unmountOnBlur: true,
                        tabBarLabel: 'Estatísticas',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcon name="pie-chart" color={color} size={36} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileRouter}
                    options={{
                        unmountOnBlur: true,
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
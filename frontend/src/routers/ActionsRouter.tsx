import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CreateExpense from "../screens/CreateExpense";
import CreateEarning from "../screens/CreateEarning";
import Actions from "../screens/Actions";
import PayBills from "../screens/PayBills";
import InvestGoals from "../screens/InvestGoals";
import CreateBills from "../screens/CreateBills";
import CreateGoals from "../screens/CreateGoals";
import ManageTransactions from "../screens/ManageTransactions";
import ManageBills from "../screens/ManageBills";
import ManageGoals from "../screens/ManageGoals";

export type ActionsStackNavigationType = {
    Actions: undefined,
    CreateExpense: undefined
    CreateEarning: undefined,
    PayBills: undefined,
    InvestGoals: undefined,
    CreateBills: undefined,
    CreateGoals: undefined,
    ManageTransactions: undefined,
    ManageBills: undefined,
    ManageGoals: undefined
}

export default function ActionsRouter(){
    const Stack = createStackNavigator<ActionsStackNavigationType>()

    return (
        <NavigationContainer
            independent={true}
        >
            <Stack.Navigator
                initialRouteName="Actions"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Actions" component={Actions} />
                <Stack.Screen name="CreateExpense" component={CreateExpense}/>
                <Stack.Screen name="CreateEarning" component={CreateEarning}/>
                <Stack.Screen name="PayBills" component={PayBills}/>
                <Stack.Screen name="InvestGoals" component={InvestGoals}/>
                <Stack.Screen name="CreateBills" component={CreateBills}/>
                <Stack.Screen name="CreateGoals" component={CreateGoals}/>
                <Stack.Screen name="ManageTransactions" component={ManageTransactions}/>
                <Stack.Screen name="ManageBills" component={ManageBills}/>
                <Stack.Screen name="ManageGoals" component={ManageGoals}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
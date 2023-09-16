import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActionsStackNavigationType } from "../routers/ActionsRouter";

interface CreateSpendingProps {
    navigation: StackNavigationProp<ActionsStackNavigationType, "CreateExpense", "CreateEarning">
}

export default function CreateExpense({navigation}: CreateSpendingProps){
    return (
        <View>
            <Text onPress={() => {
                    navigation.navigate('CreateEarning')
                }}>Create Expense</Text>
        </View>
    )
}
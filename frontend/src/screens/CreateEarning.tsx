import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { ActionsStackNavigationType } from "../routers/ActionsRouter";

interface CreateEarningProps {
    navigation: StackNavigationProp<ActionsStackNavigationType, "CreateExpense", "CreateEarning">
}

export default function CreateEarning({navigation}: CreateEarningProps){
    return (
        <View>
            <Text onPress={() => {
                    navigation.navigate('CreateExpense')
                }}>Create Earning</Text>
        </View>
    )
}
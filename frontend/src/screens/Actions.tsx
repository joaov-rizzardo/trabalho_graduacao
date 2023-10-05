import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { colors } from "../configs/Theme";
import { ActionsStackNavigationType } from '../routers/ActionsRouter'
import { StackNavigationProp } from "@react-navigation/stack";

type ActionType = {
    title: string,
    description: string,
    image: ImageSourcePropType,
    page: keyof ActionsStackNavigationType
}

const actions: ActionType[] = [
    {
        title: 'Lançar ganho',
        description: 'Registre seus ganhos para adicionar ao seu saldo.',
        image: require('../../assets/images/moedas.png'),
        page: 'CreateEarning'
    },
    {
        title: 'Pagar contas',
        description: 'Realize o pagamento das suas contas cadastradas de forma fáci e conveniente.',
        image: require('../../assets/images/pagamento-em-dinheiro.png'),
        page: 'PayBills'
    },
    {
        title: 'Lançar despesa',
        description: 'Cadastre suas despesas para manter um controle preciso dos seus gastos.',
        image: require('../../assets/images/despesas.png'),
        page: 'CreateExpense'
    },
    {
        title: 'Invista em suas metas',
        description: 'Invista nas metas cadastrqdas para alcançar seus objetivos financeiros.',
        image: require('../../assets/images/investimentos.png'),
        page: 'InvestGoals'
    },
    {
        title: 'Cadastrar contas',
        description: 'Tenha todos os seus vencimentos ao alcance das suas mãos cadastrando suas contas.',
        image: require('../../assets/images/conta.png'),
        page: 'CreateBills'
    },
    {
        title: 'Cadastrar metas',
        description: 'Aprimore seu planejamento financeiro cadastrando novas metas.',
        image: require('../../assets/images/metas.png'),
        page: 'CreateGoals'
    },
    {
        title: 'Gerenciar transações',
        description: 'Mantenha o controle das suas transações e tenha a opção de cancelá-las em caso de engano.',
        image: require('../../assets/images/transacao.png'),
        page: 'ManageTransactions'
    },
    {
        title: 'Gerenciar contas',
        description: 'Otimize o gerenciamento das suas contas e tenha a flexibilidade de cancelá-las quando necessário.',
        image: require('../../assets/images/cheque-bancario.png'),
        page: 'ManageBills'
    },
    {
        title: 'Gerenciar metas',
        description: 'Gerencie suas metas, possibilitando o cancelamento e a recuperação dos investimentos.',
        image: require('../../assets/images/prancheta.png'),
        page: 'ManageGoals'
    }
]

interface CreateEarningProps {
    navigation: StackNavigationProp<ActionsStackNavigationType>
}

export default function Actions({ navigation }: CreateEarningProps) {
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                {actions.map((action, index) => (
                    <TouchableOpacity key={index} style={styles.cardContainer} onPress={() => navigation.navigate(action.page)}>
                        <Image source={action.image} style={styles.cardImage} />
                        <View style={{flex: 1}}>
                            <Text style={styles.titleText}>{action.title}</Text>
                            <Text style={styles.descriptionText}>{action.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 10,
        borderBottomWidth: 2,
        borderColor: colors.mainColor,
        backgroundColor: colors.sections
    },
    cardImage: {
        width: 36,
        height: 36
    },
    titleText: {
        fontFamily: 'ComicNeue_400Regular',
        color: colors.highlight,
        fontSize: 16
    },
    descriptionText: {
        fontFamily: 'ComicNeue_400Regular',
        color: colors.text,
        fontSize: 12
    }

})
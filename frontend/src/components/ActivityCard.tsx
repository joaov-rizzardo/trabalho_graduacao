import { Image, StyleSheet, Text, View } from "react-native";
import DataBox from "./DataBox";
import { colors } from "../configs/Theme";

export default function ActivityCard(){
    return (
        <DataBox>
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/images/lapis.png')}/>
                <View style={{flex: 1, gap: 8}}>
                    <Text style={{...styles.text, ...styles.descriptionText}}>Gasto no valor de R$ 1.000,00 foi cancelado</Text>
                    <Text style={{...styles.text, ...styles.dateText}}>23/06/2023 17:51</Text>
                </View>
            </View>
        </DataBox>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'center'
    },
    image: {
        width: 36,
        height: 36
    },
    text: {
        fontFamily: 'ComicNeue_400Regular'
    },
    descriptionText: {
        flex: 1,
        color: colors.text,
        fontSize: 12
    },
    dateText: {
        color: colors.highlight,
        fontSize: 8,
        alignSelf: 'flex-end'
    }
})
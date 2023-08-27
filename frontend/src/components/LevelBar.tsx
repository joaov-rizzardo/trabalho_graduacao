import { StyleSheet, View } from "react-native";
import LevelStar from "./LevelStar";
import { colors } from "../configs/Theme";

export default function LevelBar(){
    return (
        <View style={styles.container}>
            <LevelStar level={72} />
            <View style={styles.bar}>
                <View style={{
                    ...styles.progressBar,
                    width: '90%'
                }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bar: {
        flex: 1,
        top: 8,
        right: 16,
        borderRadius: 10,
        backgroundColor: colors.text,
        height: 16,
        zIndex: -1
    },
    progressBar: {
        borderRadius: 10,
        backgroundColor: '#4B00829E',
        height: 16
    }
})
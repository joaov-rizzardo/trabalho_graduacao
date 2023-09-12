import { StyleSheet, View } from "react-native";
import LevelStar from "./LevelStar";
import { colors } from "../configs/Theme";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function LevelBar(){
    const {level} = useContext(UserContext)
    const percent = (level.currentXp * 100) / level.xpToNextLevel
    return (
        <View style={styles.container}>
            <LevelStar level={level.currentLevel} />
            <View style={styles.bar}>
                <View style={{
                    ...styles.progressBar,
                    width: `${percent}%`
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
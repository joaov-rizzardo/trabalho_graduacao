import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../configs/Theme";

interface LevelStarProps {
    level: number,
    size?: number
}

export default function LevelStar({level, size = 60}: LevelStarProps) {
    return (
        <View style={{
            width: size,
            height: size,
            ...styles.container
        }}>
            <Image style={styles.image} source={require('../../assets/images/estrela.png')} />
            <View style={styles.textOverlay}>
                <Text style={{
                    fontSize: size/3,
                    ...styles.text
                }}>{level}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#000'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textOverlay: {
        ...StyleSheet.absoluteFillObject,
        top: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'ComicNeue_700Bold',
        color: colors.mainColor
    }
})
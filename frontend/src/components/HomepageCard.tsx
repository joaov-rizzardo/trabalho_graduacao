import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { colors } from "../configs/Theme";

interface HomepageCardProps {
    title: string,
    value: string,
    image: ImageSourcePropType
}

export default function HomepageCard({title, value, image}: HomepageCardProps){
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={image} />
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    title: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 12,
        color: colors.text
    },
    value: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.highlight
    },
    image: {
        width: 36,
        height: 36
    }
})
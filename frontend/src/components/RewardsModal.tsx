import { Image, Modal, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { colors } from "../configs/Theme";

interface RewardsModalProps {
    xp: number,
    points: number,
    visible: boolean,
    close: () => void
}

export default function RewardsModal({xp, points, visible, close}: RewardsModalProps) {
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ gap: 12, alignItems: 'center' }}>
                        <Image source={require('../../assets/images/trofeu.png')} style={{ width: 64, height: 64 }} />
                        <Text style={styles.titleText}>Recompensas</Text>
                    </View>
                    <View style={styles.rewardContainer}>
                        <Image style={styles.rewardImage} source={require('../../assets/images/xp.png')} />
                        <Text style={styles.rewardText}>{xp} XP</Text>
                    </View>
                    <View style={styles.rewardContainer}>
                        <Image style={styles.rewardImage} source={require('../../assets/images/velocimetro.png')} />
                        <Text style={styles.rewardText}>{points} pontos</Text>
                    </View>
                    <CustomButton text="OK" onPress={close}/>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        width: '90%',
        gap: 28,
        alignItems: 'center',
        backgroundColor: colors.sections,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 16
    },
    titleText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 24,
        color: colors.highlight
    },
    rewardText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.text,
        flex: 1
    },
    rewardContainer: {
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    rewardImage: {
        width: 36,
        height: 36
    }
})
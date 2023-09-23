import { Image, Modal, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { colors } from "../configs/Theme";
import LevelStar from "./LevelStar";
import { apiURL } from "../configs/Api";

interface LevelupModalProps {
    visible: boolean,
    level: number,
    avatarRewards: number[],
    onClose: () => void
}

export default function LevelupModal({ visible, level, avatarRewards, onClose }: LevelupModalProps) {
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ gap: 12, alignItems: 'center' }}>
                        <Image source={require('../../assets/images/lancamento-de-produto.png')} style={{ width: 64, height: 64 }} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.titleText}>Parabéns</Text>
                            <Text style={styles.subtitleText}>Você subiu de nível</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <LevelStar level={level} size={60} />
                    </View>
                    {avatarRewards.length > 0 && (
                        <View style={styles.rewardsContainer}>
                            <Text style={styles.rewardsText}>Recompensas</Text>
                            <View style={styles.avatarRewardsContainer}>
                                {avatarRewards.map((avatar, index) => (
                                    <Image key={index} style={styles.avatarImage} source={{ uri: `${apiURL}/profile/avatar/${avatar}` }} />
                                ))}
                            </View>
                        </View>
                    )}
                    <CustomButton text="OK" onPress={onClose}/>
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
        gap: 24,
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
    subtitleText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.text
    },
    rewardsContainer: {
        alignItems: "center",
        width: '100%'
    },
    rewardsText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 16,
        color: colors.highlight
    },
    avatarRewardsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        borderBottomColor: colors.border,
        borderBottomWidth: 2,
        borderRadius: 10
    },
    avatarImage: {
        width: 32,
        height: 32
    }
})
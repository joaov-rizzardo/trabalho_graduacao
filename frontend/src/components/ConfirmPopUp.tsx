import { Modal, StyleSheet, View, Text } from "react-native";
import { colors } from "../configs/Theme";
import CustomButton from "./CustomButton";
import { useContext } from "react";
import { PopupContext } from "../contexts/PopupContext";

interface ConfirmPopupProps {
    visible: boolean,
    title?: string,
    content: string,
    onConfirm: () => void,
}

export default function ConfirmPopupProps({ visible, title = "Atenção", content, onConfirm }: ConfirmPopupProps) {
    const {closeConfirmPopUp} = useContext(PopupContext)
    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>{content}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <CustomButton text="Sim" onPress={() => {
                            closeConfirmPopUp()
                            onConfirm()
                        }} />
                        <CustomButton text="Não" onPress={closeConfirmPopUp} isOutline/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        width: '100%',
        height: 300,
        backgroundColor: colors.sections,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    titleContainer: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mainColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.background
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12
    },
    message: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.text,
        textAlign: 'center'
    },
    buttonsContainer: {
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 28
    },
    button: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mainColor
    },
    buttonText: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.background
    }
})
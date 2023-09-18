import { ReactNode } from "react";
import { Modal, ModalProps, StyleSheet, View } from "react-native";
import { colors } from "../configs/Theme";

interface FullscreenModalTemplateProps extends ModalProps {
    children: ReactNode,

}

export default function FullscreenModalTemplate({ children, ...props }: FullscreenModalTemplateProps) {
    return (
        <Modal {...props}>
            <View style={styles.container}>
                {children}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        backgroundColor: colors.background,
        borderRadius: 40
    }
})
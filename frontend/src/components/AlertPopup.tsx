import { Modal, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { colors } from "../configs/Theme";
import { useContext } from "react";
import { PopupContext } from "../contexts/PopupContext";

interface AlertPopupProps {
    visible: boolean,
    title?: string,
    content: string,
    buttonText?: string,
    buttonFunction?: () => void
}

export default function AlertPopup({visible, title = "Atenção", content, buttonText = 'OK', buttonFunction}: AlertPopupProps){

    const {closeAlertPopup} = useContext(PopupContext)
    
    function handleButtonClick(){
        closeAlertPopup()
        if(buttonFunction !== undefined){
            buttonFunction()
        }
    }
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
                    <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    content: {
        width: '100%',
        height: 300,
        backgroundColor: colors.sections
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
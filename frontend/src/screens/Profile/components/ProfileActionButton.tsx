import { TouchableOpacity, Text, ImageSourcePropType, TouchableOpacityProps, StyleSheet, Image} from 'react-native'
import { colors } from '../../../configs/Theme'

interface ProfileActionButtonProps extends TouchableOpacityProps {
    image: ImageSourcePropType
    label: string
}

export default function ProfileActionButton({image, label, ...props}: ProfileActionButtonProps){
    return (
        <TouchableOpacity style={styles.container} {...props}>
            <Image source={image} style={styles.image}/>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.sections,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 64,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border
    },
    image: {
        width: 36,
        height: 36
    },
    text: {
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.text
    }

})
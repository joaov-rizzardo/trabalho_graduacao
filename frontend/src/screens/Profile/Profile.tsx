
import { useContext } from 'react'
import { Text, ScrollView, StyleSheet, Image} from "react-native";
import ScreenTemplate from "../../components/ScreenTemplate";
import { apiURL } from "../../configs/Api";
import ProfileActionButton from "./components/ProfileActionButton";
import { colors } from "../../configs/Theme";
import { AuthContext } from '../../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackNavigationType } from '../../routers/ProfileRouter';

interface ProfileProps {
    navigation: StackNavigationProp<ProfileStackNavigationType, "ProfileMenu">
}

export default function Profile({navigation}: ProfileProps) {
    const { user, logout } = useContext(AuthContext)
    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <Image style={styles.image} source={user.selectedAvatar ? { uri: `${apiURL}/profile/avatar/${user.selectedAvatar}` } : require('../../../assets/images/default-picture.jpg')} />
                <Text style={styles.nameText}>{user.name}</Text>
                <ProfileActionButton 
                    image={require('../../../assets/images/perfil.png')}
                    label="Editar Perfil"
                    onPress={() => navigation.navigate('ProfileUpdate')}
                />
                <ProfileActionButton 
                    image={require('../../../assets/images/sair.png')}
                    onPress={logout}
                    label="Sair"
                />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        alignItems: 'center',
        flexGrow: 1
    },
    image: {
        width: 175,
        height: 175,
        borderRadius: 175
    },
    nameText: {
        fontFamily: 'ComicNeue_700Bold',
        fontSize: 20,
        color: colors.highlight,
        textAlign: 'center'
    }
})
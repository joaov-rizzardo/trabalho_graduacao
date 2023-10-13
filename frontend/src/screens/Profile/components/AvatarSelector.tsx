import FullscreenModalTemplate from "../../../components/FullscreenModalTemplate";
import IconButton from "../../../components/IconButton";
import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { colors } from "../../../configs/Theme";
import { apiURL, backendApi } from "../../../configs/Api";
import { useEffect, useState } from "react";
import { GetUserAvatars } from "../../../types/ApiResponses/ProfileTypes";

async function findUserAvatars() {
    try {
        const { data: avatars } = await backendApi.get<GetUserAvatars[]>('/profile/userAvatars')
        return avatars
    } catch (error: any) {
        console.log(error)
        return []
    }
}

interface AvatarSelectorProps {
    visible: boolean
    close: () => void
    changeAvatar: (avatar: number) => void,
    selectedAvatar: number
}

export default function AvatarSelector({ visible, close, selectedAvatar, changeAvatar }: AvatarSelectorProps) {
    const [userAvatars, setUserAvatars] = useState<GetUserAvatars[]>([])
    useEffect(() => {
        findUserAvatars().then(avatars => setUserAvatars(avatars))
    }, [])
    return (
        <FullscreenModalTemplate visible={visible} transparent={true} animationType="slide">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <IconButton icon="close" size={36} color={colors.mainColor} onPress={close} />
                <View style={styles.avatarList}>
                    {userAvatars.map((avatar, index) => (
                        <TouchableOpacity style={{
                            ...styles.avatarContainer,
                            borderColor: selectedAvatar === avatar.avatarId ? colors.mainColor : colors.border
                        }} key={index} onPress={() => changeAvatar(avatar.avatarId)}>
                            <Image style={styles.image} source={{ uri: `${apiURL}/profile/avatar/${avatar.avatarId}` }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </FullscreenModalTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        padding: 16
    },
    avatarList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 12
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        padding: 12,
        borderRadius: 16,
        flex: 1,
        minWidth: 120,
        maxHeight: 120
    },
    image: {
        width: 100,
        height: 100,
    }
})
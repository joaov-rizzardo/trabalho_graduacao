import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import CustomInput from '../../components/CustomInput'
import ScreenTemplate from '../../components/ScreenTemplate'
import CustomButton from '../../components/CustomButton'
import { AuthContext } from '../../contexts/AuthContext'
import { useContext,  useState} from "react"
import { PopupContext } from '../../contexts/PopupContext'
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { apiURL, backendApi } from '../../configs/Api'
import { colors } from '../../configs/Theme'
import AvatarSelector from './components/AvatarSelector'

type ChangeUserProfileType = {
    name: string
    lastName: string
    avatarId: number
}
async function changeUserProfile({name, lastName, avatarId}: ChangeUserProfileType){
    try {
        await backendApi.post('/profile/updateProfile', {
            name: name,
            lastName: lastName,
            selectedAvatar: avatarId
        })
        return {ok: true, message: 'O perfil foi atualizado com sucesso'}
    }catch(error: any){
        console.log(error)
        return {ok: false, message: 'Não foi possível atualizar o perfil, tente novamente mais tarde'}
    }
}

export default function ChangeProfile() {
    const { user, changeUserProfile: changeUserProfileState } = useContext(AuthContext)
    const { openAlertPopup } = useContext(PopupContext)
    const [name, setName] = useState<string>(user.name)
    const [lastName, setLastName] = useState<string>(user.lastName)
    const [selectedAvatar, setSelectedAvatar] = useState<number>(user.selectedAvatar)
    const [isVisibleAvatarSelector, setIsVisibleAvatarSelector] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSave(){
        const validationResponse = handleValidations()
        if(validationResponse.ok === false){
            return openAlertPopup({
                title: 'Atenção',
                content: validationResponse.message
            })
        }
        const {ok, message} = await changeUserProfile({
            name, lastName, avatarId: selectedAvatar
        })
        if(ok === true){
            changeUserProfileState({
                avatarId: selectedAvatar,
                name: name,
                lastName: lastName
            })
        }
        return openAlertPopup({
            title: ok ? 'Sucesso' : 'Atenção',
            content: message
        })
    }

    function handleValidations(){
        if(name.trim() === ""){
            return { ok: false, message: 'Por favor, informe um nome'}
        }
        if(lastName.trim() === ""){
            return { ok: false, message: 'Por favor, informe o sobrenome'}
        }
        return { ok: true, message: ''}
    }

    return (
        <ScreenTemplate>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <AvatarSelector 
                visible={isVisibleAvatarSelector} 
                close={() => setIsVisibleAvatarSelector(false)}
                selectedAvatar={selectedAvatar}
                changeAvatar={(avatarId) => {
                    setSelectedAvatar(avatarId)
                    setIsVisibleAvatarSelector(false)
                }}
            />
                <TouchableOpacity style={styles.imageSelector} onPress={() => setIsVisibleAvatarSelector(true)}>
                    <Image style={{width: 175, height: 175}} source={selectedAvatar ? { uri: `${apiURL}/profile/avatar/${selectedAvatar}` } : require('../../../assets/images/default-picture.jpg')}/>
                    <MaterialIcon style={styles.iconStyle} name='edit' size={36} color={colors.mainColor}/>
                </TouchableOpacity>
                <CustomInput.Container>
                    <CustomInput.Icon iconName='badge' />
                    <CustomInput.Input 
                        placeholder='Nome' 
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                </CustomInput.Container>
                <CustomInput.Container>
                    <CustomInput.Icon iconName='face' />
                    <CustomInput.Input 
                        placeholder='Sobrenome' 
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                    />
                </CustomInput.Container>
                <CustomButton 
                    text='Salvar'
                    loading={isLoading}
                    onPress={async () => {
                        setIsLoading(true)
                        await handleSave()
                        setIsLoading(false)
                    }}
                />
            </ScrollView>
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20
    },
    imageSelector: {
        alignItems: 'center',
        position: 'relative'
    },
    iconStyle: {
        position: "absolute",
        right: 80,
        bottom: -10,
        backgroundColor: '#fff',
        borderRadius: 36,
        padding: 10,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
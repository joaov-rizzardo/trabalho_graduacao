import { TextInput, TextInputProps } from "react-native";
import { colors } from "../../configs/Theme";

interface InputProps extends TextInputProps {

}
export default function Input({...rest}: InputProps){
    return (
        <TextInput
            style={{
                flex: 1,
                fontSize: 20,
                fontFamily: 'ComicNeue_400Regular',
                height: '100%',
                color: colors.text
            }}
            {...rest} 
        />
    )
}
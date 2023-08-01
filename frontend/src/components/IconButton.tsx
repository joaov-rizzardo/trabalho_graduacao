import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors } from "../configs/Theme";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

interface CustomButtonProps extends TouchableOpacityProps {
    size?: number
    color?: string
    loading?: boolean
    icon: React.ComponentProps<typeof MaterialIcon>['name']
}

export default function IconButton({ loading = false, size = 28, color = colors.mainColor, icon, ...props }: CustomButtonProps) {
    return (
        <TouchableOpacity {...props} >
            {
                loading === true
                    ? <ActivityIndicator size="large" color={color} />
                    : <MaterialIcon size={size} color={color} name={icon}/>
            }
        </TouchableOpacity>
    )
}
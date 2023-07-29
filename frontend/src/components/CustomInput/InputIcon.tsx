import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../configs/Theme';

interface InputIconProps {
    iconName: React.ComponentProps<typeof MaterialIcon>['name']
}

export default function InputIcon({iconName}: InputIconProps){
    return (
        <MaterialIcon name={iconName} size={36} color={colors.mainColor}/>
    )
}

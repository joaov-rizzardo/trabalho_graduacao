import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../configs/Theme";

type OptionType<T> = {
    value: T,
    description: string
}

interface OptionSelectorProps<T extends string | number, U extends string | number> {
    options: [OptionType<T>, OptionType<U>],
    value: T | U,
    setValue: React.Dispatch<React.SetStateAction<T | U>>
}

export default function OptionSelector<T extends string | number, U extends string | number>({ options, value, setValue }: OptionSelectorProps<T, U>) {
    return (
        <View style={styles.container}>
            {options.map(({ value: optionValue, description }) => (
                <TouchableOpacity
                    onPress={() => setValue(optionValue)}
                    style={{
                        ...styles.itemContainer,
                        backgroundColor: value === optionValue ? colors.mainColor : colors.sections

                    }}>
                    <Text style={{
                        ...styles.itemText,
                        color: value === optionValue ? colors.sections : colors.mainColor
                    }}>{description}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.sections,
        borderColor: colors.mainColor,
        borderWidth: 1,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flex: 1
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'ComicNeue_400Regular'
    }
})
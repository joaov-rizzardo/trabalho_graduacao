import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { colors } from "../configs/Theme";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDateToBrString } from "../Utils/DateUtils";

interface DatepickerProps {
    date: Date | null,
    setDate: React.Dispatch<React.SetStateAction<Date | null>>
    placeholder: string
}

export default function Datepicker({date, setDate, placeholder}: DatepickerProps) {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    return (
        <>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                <Image style={styles.inputImage} source={require('../../assets/images/calendario-desktop.png')} />
                <Text style={styles.inputText}>{date ? formatDateToBrString(date) : placeholder}</Text>
                <MaterialIcon name="expand-more" size={36} color={colors.mainColor} />
            </TouchableOpacity>
            {showDatePicker && (
                <RNDateTimePicker accentColor={colors.mainColor} value={date || new Date()} onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        setShowDatePicker(false)
                        setDate(selectedDate)
                    }
                }} />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 48,
        borderRadius: 10,
        borderWidth: 2,
        gap: 16,
        borderColor: colors.border,
        backgroundColor: colors.sections,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    inputImage: {
        width: 36,
        height: 36
    },
    inputText: {
        flex: 1,
        fontFamily: 'ComicNeue_400Regular',
        fontSize: 20,
        color: colors.text
    }
})
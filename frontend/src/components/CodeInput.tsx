import { useRef, useState } from "react";
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from "react-native";
import { colors } from "../configs/theme";

interface CodeInputProps {
    changeValue: React.Dispatch<React.SetStateAction<string>>,
}

export default function CodeInput({changeValue}: CodeInputProps){
    const inputRefs = Array.from({length: 5}, () => useRef<TextInput>(null))
    const [inputsValues, setInputValues] = useState<string[]>(Array.from({length: 5}, () => ''))

    function handleTextChange(index: number, text: string){
        if(text !== ""){
            changeInputValue(text, index)
            changeValue(inputsValues.join(''))
            const nextInputIndex = text !== "" ? index + 1 : index - 1
            handleFocusChange(nextInputIndex)
        }
    }

    function handleInputPress(){
        const currentPositionIndex = inputsValues.reduce((carry, currentItem, index) => {
            if(currentItem !== ""){
                carry = index + 1
            }
            carry = carry <= 4 ? carry : 4
            return carry
        },0)
        handleFocusChange(currentPositionIndex)
    }

    function handleKeyPress(event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number){
        if(event.nativeEvent.key === 'Backspace'){
            const targetValueIndex = inputsValues[index] !== "" ? index : index - 1
            if(inputsValues[targetValueIndex] !== undefined){
                changeInputValue('', targetValueIndex)
                handleFocusChange(targetValueIndex)
            }
            
        }
    }

    function changeInputValue(value: string, index: number){
        setInputValues(innitialState => {
            return innitialState.map((state, stateIndex) => {
                if(stateIndex === index){
                    return value.toUpperCase()
                }
                return state
            })
        })
    }

    function handleFocusChange(indexTarget: number){
        if(indexTarget >= 0 && indexTarget <= 4){
            setInputFocus(indexTarget)
            return
        }
        if(indexTarget > 4){
            setInputFocus(4)
            return
        }
        if(indexTarget < 0){
            setInputFocus(0)
            return
        }
    }

    function setInputFocus(inputIndex: number){
        const inputTarget = inputRefs[inputIndex]
        if(inputTarget !== undefined){
            inputTarget.current?.focus()
        }
    }
    return (
        <View style={styles.container}>
            {inputRefs.map((inputRef, index) => (
                <TextInput 
                    key={index}
                    ref={inputRef}
                    style={styles.inputStyle}
                    value={inputsValues[index]}
                    onChangeText={(text) => handleTextChange(index, text)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    onPressOut={handleInputPress}
                    maxLength={1}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 16
    },
    inputStyle: {
        fontSize: 36,
        width: 48,
        textAlign: 'center',
        color: colors.highlight,
        fontFamily: 'ComicNeue_700Bold',
        borderBottomWidth: 5,
        borderBottomColor: colors.mainColor
    }
})
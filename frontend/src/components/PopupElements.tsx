import { PopupContext } from "../contexts/PopupContext";
import AlertPopup from "./AlertPopup";
import {useContext} from 'react'

export default function PopupElements(){

    const {alertConfigs} = useContext(PopupContext)
    
    return (
        <>
            <AlertPopup 
                visible={alertConfigs.visible} 
                content={alertConfigs.content}
                buttonFunction={alertConfigs.buttonFunction}
                buttonText={alertConfigs.buttonText}
                title={alertConfigs.title}
            />
        </>
    )
}
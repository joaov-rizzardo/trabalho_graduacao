import { useState } from "react"

export type AlertPopupConfigsType = {
    visible: boolean,
    buttonFunction?: () => void,
    title?: string,
    content: string,
    buttonText?: string
}

export type openAlertType = {
    buttonFunction?: () => void,
    title?: string,
    content: string,
    buttonText?: string
}

export default function usePopup(){
    const [alertConfigs, setAlertConfigs] = useState<AlertPopupConfigsType>({
        visible: false,
        content: ''
    })

    const openAlertPopup = (params: openAlertType) => {
        const newConfigs: AlertPopupConfigsType = {} as AlertPopupConfigsType
        newConfigs.visible = true
        newConfigs.content = params.content
        if(params.buttonFunction !== undefined){
            newConfigs.buttonFunction = params.buttonFunction
        }
        if(params.title !== undefined){
            newConfigs.title = params.title
        }
        if(params.buttonText !== undefined){
            newConfigs.buttonText = params.buttonText
        }
        setAlertConfigs(newConfigs)
    }

    const closeAlertPopup = () => {
        setAlertConfigs({
            visible: false,
            content: ''
        })
    }

    return {alertConfigs, openAlertPopup, closeAlertPopup}
}
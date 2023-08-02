import React, { ReactNode, createContext } from "react";
import usePopup, { AlertPopupConfigsType, openAlertType } from "../hooks/usePopup";

type PopupContextType = {
    openAlertPopup: (params: openAlertType) => void,
    closeAlertPopup: () => void,
    alertConfigs: AlertPopupConfigsType
}

const PopupContext = createContext<PopupContextType>({} as PopupContextType)

function PopupProvider({children}: {children: ReactNode}){
    const {openAlertPopup, closeAlertPopup, alertConfigs} = usePopup()
    return (
        <PopupContext.Provider value={{openAlertPopup, closeAlertPopup, alertConfigs}}>
            {children}
        </PopupContext.Provider>
    )
}

export {PopupContext, PopupProvider}
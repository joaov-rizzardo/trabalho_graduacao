import React, { ReactNode, createContext } from "react";
import usePopup, { AlertPopupConfigsType, ConfirmPopUpType, LevelUpModalType, RewardsModalType, openAlertType, openConfirmPopUpType, openLevelupModalType, openRewardsModalType } from "../hooks/usePopup";

type PopupContextType = {
    alertConfigs: AlertPopupConfigsType
    openAlertPopup: (params: openAlertType) => void
    closeAlertPopup: () => void
    openModalRewards: (configs: openRewardsModalType) => void
    closeModalRewards: () => void
    rewardsModalConfigs: RewardsModalType
    openModalLevelup: (configs: openLevelupModalType) => void
    closeModalLevelup: () => void
    levelupModalConfigs: LevelUpModalType
    openConfirmPopUp: (configs: openConfirmPopUpType) => void
    closeConfirmPopUp: () => void
    confirmPopUpConfigs: ConfirmPopUpType
}

const PopupContext = createContext<PopupContextType>({} as PopupContextType)

function PopupProvider({ children }: { children: ReactNode }) {
    const {
        openAlertPopup,
        closeAlertPopup,
        alertConfigs,
        openModalRewards,
        closeModalRewards,
        rewardsModalConfigs,
        openModalLevelup,
        closeModalLevelup,
        levelupModalConfigs,
        openConfirmPopUp,
        closeConfirmPopUp,
        confirmPopUpConfigs
    } = usePopup()
    return (
        <PopupContext.Provider value={{
            openAlertPopup,
            closeAlertPopup,
            alertConfigs,
            openModalRewards,
            closeModalRewards,
            rewardsModalConfigs,
            openModalLevelup,
            closeModalLevelup,
            levelupModalConfigs,
            openConfirmPopUp,
            closeConfirmPopUp,
            confirmPopUpConfigs
        }}>
            {children}
        </PopupContext.Provider>
    )
}

export { PopupContext, PopupProvider }
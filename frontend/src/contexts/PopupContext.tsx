import React, { ReactNode, createContext } from "react";
import usePopup, { AlertPopupConfigsType, LevelUpModalType, RewardsModalType, openAlertType, openLevelupModalType, openRewardsModalType } from "../hooks/usePopup";

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
        levelupModalConfigs
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
            levelupModalConfigs
        }}>
            {children}
        </PopupContext.Provider>
    )
}

export { PopupContext, PopupProvider }
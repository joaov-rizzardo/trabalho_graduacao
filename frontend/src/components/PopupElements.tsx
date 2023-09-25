import { PopupContext } from "../contexts/PopupContext";
import AlertPopup from "./AlertPopup";
import {useContext} from 'react'
import RewardsModal from "./RewardsModal";
import LevelupModal from "./LevelupModal";
import ConfirmPopupProps from "./ConfirmPopUp";

export default function PopupElements(){

    const {alertConfigs, closeModalRewards, rewardsModalConfigs, levelupModalConfigs, closeModalLevelup, confirmPopUpConfigs} = useContext(PopupContext)
    
    return (
        <>
            <AlertPopup 
                visible={alertConfigs.visible} 
                content={alertConfigs.content}
                buttonFunction={alertConfigs.buttonFunction}
                buttonText={alertConfigs.buttonText}
                title={alertConfigs.title}
            />
            <RewardsModal 
                visible={rewardsModalConfigs.visible} 
                close={closeModalRewards} 
                xp={rewardsModalConfigs.xp} 
                points={rewardsModalConfigs.points} 
            />
            <LevelupModal 
                visible={levelupModalConfigs.visible}
                level={levelupModalConfigs.level}
                onClose={closeModalLevelup}
                avatarRewards={levelupModalConfigs.avatarRewards}
            />
            <ConfirmPopupProps 
                visible={confirmPopUpConfigs.visible}
                content={confirmPopUpConfigs.content}
                onConfirm={confirmPopUpConfigs.onConfirm}
                title={confirmPopUpConfigs.title}
            />
        </>
    )
}
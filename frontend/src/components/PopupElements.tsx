import { PopupContext } from "../contexts/PopupContext";
import AlertPopup from "./AlertPopup";
import {useContext} from 'react'
import RewardsModal from "./RewardsModal";
import LevelupModal from "./LevelupModal";

export default function PopupElements(){

    const {alertConfigs, closeModalRewards, rewardsModalConfigs, levelupModalConfigs, closeModalLevelup} = useContext(PopupContext)
    
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
        </>
    )
}
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


export type RewardsModalType = {
    visible: boolean,
    xp: number,
    points: number,
    close?: () => void
}


export type openRewardsModalType = {
    xp: number,
    points: number,
    close?: () => void
}

export type LevelUpModalType = {
    visible: boolean,
    level: number,
    avatarRewards: number[],
    onClose?: () => void
}


export type openLevelupModalType = {
    level: number,
    avatarRewards: number[],
    onClose?: () => void
}

const innitialRewardsModalType: RewardsModalType = {
    visible: false,
    xp: 0,
    points: 0
}

const innitialLevelupModalType: LevelUpModalType = {
    visible: false,
    level: 0,
    avatarRewards: []
}

export default function usePopup() {
    const [alertConfigs, setAlertConfigs] = useState<AlertPopupConfigsType>({
        visible: false,
        content: ''
    })
    const [rewardsModalConfigs, setRewardsModalConfigs] = useState<RewardsModalType>(innitialRewardsModalType)
    const [levelupModalConfigs, setLevelupModalConfigs] = useState<LevelUpModalType>(innitialLevelupModalType)

    const openAlertPopup = (params: openAlertType) => {
        const newConfigs: AlertPopupConfigsType = {} as AlertPopupConfigsType
        newConfigs.visible = true
        newConfigs.content = params.content
        if (params.buttonFunction !== undefined) {
            newConfigs.buttonFunction = params.buttonFunction
        }
        if (params.title !== undefined) {
            newConfigs.title = params.title
        }
        if (params.buttonText !== undefined) {
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

    const openModalRewards = (configs: openRewardsModalType) => {
        setRewardsModalConfigs({
            visible: true,
            ...configs
        })
    }

    const closeModalRewards = () => {
        const closeFunction = rewardsModalConfigs.close
        setRewardsModalConfigs(innitialRewardsModalType)
        closeFunction && closeFunction()
    }

    const openModalLevelup = (configs: openLevelupModalType) => {
        setLevelupModalConfigs({
            visible: true,
            ...configs
        })
    }

    const closeModalLevelup = () => {
        const closeFunction = levelupModalConfigs.onClose
        setLevelupModalConfigs(innitialLevelupModalType)
        closeFunction && closeFunction()
    }

    return {
        alertConfigs,
        openAlertPopup,
        closeAlertPopup,
        openModalRewards,
        closeModalRewards,
        rewardsModalConfigs,
        openModalLevelup,
        closeModalLevelup,
        levelupModalConfigs
    }
}
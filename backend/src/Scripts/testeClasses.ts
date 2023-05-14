import dotenv from 'dotenv'
import { query } from '../Services/Database'
import { BillEnum } from '../Enums/BillEnum'
import User from '../Models/User'
import getCurrentStringDatetime from '../Utils/DateUtils'
import UserFinance from '../Models/UserFinance'
import UserLevel from '../Models/UserLevel'
import Avatar from '../Models/Avatar'
import UserAvatars from '../Models/UserAvatars'
import Activity from '../Models/Activity'
import UserActivitys from '../Models/UserActivitys'
import Goal from '../Models/Goal'

dotenv.config()

try {
    teste()
}catch(error){
    console.log(error)
}

async function teste(){
    const goal = await Goal.getInstanceById(1)
    console.log(goal.goalIsCanceled())
} 
import dotenv from 'dotenv'
import { query } from '../Services/Database'
import { BillEnum } from '../Enums/BillEnum'

dotenv.config()

const x = "V"

console.log(BillEnum[x])

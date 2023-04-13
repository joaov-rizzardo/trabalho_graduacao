import dotenv from 'dotenv'
import { query } from '../Services/Database'

dotenv.config()

select()

async function select(){
    const response = await query('SELECT * FROM User WHERE userId = 1')
    if(response !== false){
        console.log(response)
    }
    
}

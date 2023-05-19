import dotenv from 'dotenv'
import extractKeyValueArgs from './Utils/ArgsParser'
import ScriptsMapper from './Config/ScriptsMapper'

dotenv.config()
const args = extractKeyValueArgs(process.argv)
if(!args.script){
    console.log('Nenhum script foi informado para execução')
    process.exit()
}
if(ScriptsMapper[args.script] === undefined){
    console.log('O script informado não existe')
    process.exit()
}
ScriptsMapper[args.script](args)

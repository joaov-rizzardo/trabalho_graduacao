export interface Args {
    [key: string]: string
}

export default function extractKeyValueArgs(args: string[]){
    const slicedArgs = args.slice(2)
    const argsObj: Args = {}
    slicedArgs.forEach(arg => {
        const [key, value] = arg.split('=')
        argsObj[key] = value
    })
    return argsObj
}
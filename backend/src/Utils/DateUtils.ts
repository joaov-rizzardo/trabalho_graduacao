export default function getCurrentStringDatetime(){
    const datetime = new Date();
    return convertDateObjectDatetimeToString(datetime)
}

export function getCurrentStringDate(){
    const datetime = new Date()
    const year = datetime.getFullYear()
    const month = String(datetime.getMonth() + 1).padStart(2, '0')
    const day = String(datetime.getDate()).padStart(2, '0')
    const formatedDate = `${year}-${month}-${day}`
    return formatedDate
}

export function convertDateObjectDatetimeToString(date: Date){
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    const formatedDatetime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    return formatedDatetime
}
export default function getCurrentStringDatetime(){
    const datetime = new Date();
    const year = datetime.getFullYear()
    const month = String(datetime.getMonth() + 1).padStart(2, '0')
    const day = String(datetime.getDate()).padStart(2, '0')
    const hour = String(datetime.getHours()).padStart(2, '0')
    const minute = String(datetime.getMinutes()).padStart(2, '0')
    const second = String(datetime.getSeconds()).padStart(2, '0')
    const formatedDatetime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    return formatedDatetime
}

export function getCurrentStringDate(){
    const datetime = new Date()
    const year = datetime.getFullYear()
    const month = String(datetime.getMonth() + 1).padStart(2, '0')
    const day = String(datetime.getDate()).padStart(2, '0')
    const formatedDate = `${year}-${month}-${day}`
    return formatedDate
}
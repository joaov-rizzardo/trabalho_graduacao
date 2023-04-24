export default function getCurrentStringDatetime(){
    const currentDate = new Date();
    return  currentDate.toISOString().slice(0, 19).replace('T', ' ');
}
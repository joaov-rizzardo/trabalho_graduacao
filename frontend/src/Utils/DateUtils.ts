export function getThirtyDaysIntervalDateString() {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    return {
        startDate: formatDateToString(startDate),
        endDate: formatDateToString(endDate)
    }
}

export function formatDateToString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function formatDatetimeToBrString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hour}/${minute}`
}

export function formatDateToBrString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`
}

export function dateDiferenceInDays(date1: Date, date2: Date) {
    const diffInMiliseconds = Math.abs(date2.getTime() - date1.getTime())
    const dayInMiliseconds = 1000 * 60 * 60 * 24
    const diffInDays = Math.floor(diffInMiliseconds / dayInMiliseconds)
    return diffInDays
}


export function getDatesByInterval(interval: number) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - interval)
    return {
        startsAt: formatDateToString(startDate),
        endsAt: formatDateToString(endDate)
    }
}
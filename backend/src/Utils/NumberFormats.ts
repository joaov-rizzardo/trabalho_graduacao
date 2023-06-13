export function formatNumberToCurrency(number: number){
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    return formatter.format(number)
}
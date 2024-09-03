export type Payment = {
    id: number
    date: string
    payment_method: string
    amount: number
    comment: string
}

export function isPayment(data: unknown): data is Payment {
    return !!data &&
        typeof (data as Payment).id === 'number' &&
        typeof (data as Payment).date === 'string' &&
        typeof (data as Payment).payment_method === 'string' &&
        typeof (data as Payment).amount === 'number' &&
        typeof (data as Payment).comment === 'string'
}

export function isPaymentHistory(datas: unknown): datas is Payment[] {
    return Array.isArray(datas) && datas.every(data => isPayment(data))
}
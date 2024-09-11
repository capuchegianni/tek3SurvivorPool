export type Payment = {
  id: number
  date: string
  paymentMethod: string
  amount: number
  comment: string
}

export type BasicPayment = Omit<Payment, 'id'>

export function isPayment(data: unknown): data is Payment {
  return !!data &&
    typeof (data as Payment).id === 'number' &&
    typeof (data as Payment).date === 'string' &&
    typeof (data as Payment).paymentMethod === 'string' &&
    typeof (data as Payment).amount === 'number' &&
    typeof (data as Payment).comment === 'string'
}

export function isPaymentsHistory(datas: unknown): datas is Payment[] {
  return Array.isArray(datas) && datas.every(data => isPayment(data))
}

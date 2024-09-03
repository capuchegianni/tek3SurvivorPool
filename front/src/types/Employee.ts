export type Employee = {
    id: number
    email: string
    name: string
    surname: string
    birth_date: string
    gender: string
    work: string
}

export type EmployeeDTO = {
    id: number
    email: string
    name: string
    surname: string
}

export function isEmployee(data: unknown): data is Employee {
    return data !== null && data !== undefined &&
        typeof (data as Employee).id === 'number' &&
        typeof (data as Employee).email === 'string' &&
        typeof (data as Employee).name === 'string' &&
        typeof (data as Employee).surname === 'string'
}

export function isEmployees(datas: unknown[]): datas is Employee[] {
    return Array.isArray(datas) && datas.every(data => isEmployee(data))
}
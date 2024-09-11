export type Employee = {
  id: number
  email: string
  name: string
  surname: string
  birth_date: string
  gender: string
  work: string
  image: string
  assigned_customers: string[]
}

export type EmployeeDTO = {
  id: number
  email: string
  name: string
  surname: string
}

export function isEmployee(data: unknown): data is Employee {
  return !!data &&
    typeof (data as Employee).id === 'number' &&
    typeof (data as Employee).email === 'string' &&
    typeof (data as Employee).name === 'string' &&
    typeof (data as Employee).surname === 'string' &&
    typeof (data as Employee).birth_date === 'string' &&
    typeof (data as Employee).gender === 'string' &&
    typeof (data as Employee).work === 'string'
}

export function isEmployeeDTO(data: unknown): data is EmployeeDTO {
  return !!data &&
    typeof (data as EmployeeDTO).id === 'number' &&
    typeof (data as EmployeeDTO).email === 'string' &&
    typeof (data as EmployeeDTO).name === 'string' &&
    typeof (data as EmployeeDTO).surname === 'string'
}

export function isEmployees(datas: unknown): datas is EmployeeDTO[] {
  return Array.isArray(datas) && datas.every(data => isEmployeeDTO(data))
}
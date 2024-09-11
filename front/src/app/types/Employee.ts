import { Event } from "./Event"

export type Employee = {
  id: number
  email: string
  name: string
  surname: string
  birthDate: string
  gender: string
  work: string
  events: Event[]
  image: string
  assignedCustomers: number[]
}

export type BasicEmployee = Omit<Employee, 'id' | 'events' | 'image' | 'assignedCustomers'>

export type BasicEmployeeWithID = Omit<Employee, 'events' | 'image' | 'assignedCustomers'>

export type EmployeeDTO = {
  fullName(fullName: any): unknown
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
    typeof (data as Employee).birthDate === 'string' &&
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

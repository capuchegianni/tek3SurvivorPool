import { Event } from "./Event"

export type Employee = {
  id: number
  email: string
  name: string
  surname: string
  birth_date: string
  gender: string
  work: string
  events: Event[]
  image: string
  assigned_customers: number[]
}

export type BasicEmployee = Omit<Employee, 'id' | 'events' | 'image' | 'assigned_customers'>

export type BasicEmployeeWithID = Omit<Employee, 'events' | 'image' | 'assigned_customers'>

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

export function isEmployees(datas: unknown): datas is Employee[] {
  return Array.isArray(datas) && datas.every(data => isEmployee(data))
}

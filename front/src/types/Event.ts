export type Event = {
    id: number
    name: string
    date: string
    max_participants: number
    location_x: string
    location_y: string
    type: string
    employee_id: number
    location_name: string
}

export type EventDTO = {
    id: number
    name: string
    date: string
    max_participants: number
}
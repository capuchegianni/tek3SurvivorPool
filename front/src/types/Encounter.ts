export type Encounter = {
    id: number
    customer_id: number
    date: string
    rating: number
    comment: string
    source: string
}

export type EncounterDTO = {
    id: number
    customer_id: number
    date: string
    rating: number
}
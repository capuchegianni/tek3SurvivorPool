export type Clothe = {
    id: number
    type: string
}

export function isClothe(data: unknown): data is Clothe {
    return !!data &&
        typeof (data as Clothe).id === 'number' &&
        typeof (data as Clothe).type === 'string'
}

export function isClothes(datas: unknown): datas is Clothe[] {
    return Array.isArray(datas) && datas.every(data => isClothe(data))
}
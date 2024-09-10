export type Clothe = {
  id: number
  type: string
  image: string
}

export type BasicClothe = Omit<Clothe, 'id'>

export function isClothe(data: unknown): data is Clothe {
  return !!data &&
    typeof (data as Clothe).id === 'number' &&
    typeof (data as Clothe).type === 'string' &&
    typeof (data as Clothe).image === 'string'
}

export function isClothes(datas: unknown): datas is Clothe[] {
  return Array.isArray(datas) && datas.every(data => isClothe(data))
}

export type Tip = {
  id: number
  title: string
  tip: string
}

export function isTip(data: unknown): data is Tip {
  return !!data &&
    typeof (data as Tip).id === 'number' &&
    typeof (data as Tip).title === 'string' &&
    typeof (data as Tip).tip === 'string'
}

export function isTips(datas: unknown): datas is Tip[] {
  return Array.isArray(datas) && datas.every(data => isTip(data))
}
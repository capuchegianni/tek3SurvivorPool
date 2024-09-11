export type Credentials = {
  email: string
  password: string
}

export type Token = {
  token: string
}

export function isToken(data: unknown): data is Token {
  return !!data && typeof (data as Token).token === 'string'
}

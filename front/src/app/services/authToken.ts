export const getAuthHeader = (): string => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')

        return token ? `Bearer ${token}` : ''
    }
    return ''
}

export const setAuthHeader = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
    }
}
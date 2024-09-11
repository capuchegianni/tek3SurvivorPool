export default class FetchError extends Error {
    status: number
    statusText: string
    details: string | null

    constructor(data: { message: string, status: number, statusText: string, details: string | null }) {
        super(data.message)
        this.status = data.status
        this.statusText = data.statusText
        this.details = data.details
        this.name = 'FetchError'
    }

    public logError() {
        console.error('FetchError:', {
            message: this.message,
            status: this.status,
            statusText: this.statusText,
            details: this.details,
        });
    }
}


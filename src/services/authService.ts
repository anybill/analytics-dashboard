
interface LoginResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: string
}

class AuthService {
    private static instance: AuthService
    private accessToken: string | null = null
    private refreshToken: string | null = null
    private tokenExpiry: Date | null = null



    private constructor() { }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    async login(): Promise<void> {
        const credentials = {
            Username: import.meta.env.VITE_ANYBILL_USERNAME,
            Password: import.meta.env.VITE_ANYBILL_PASSWORD
        }
        try {
            const response = await fetch('https://partner.stg.anybill.de/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })

            if (!response.ok) {
                throw new Error('Login failed')
            }

            const data: LoginResponse = await response.json()
            this.setTokens(data)
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    private setTokens(data: LoginResponse): void {
        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token
        // Set expiry time (convert expires_in to milliseconds and add to current time)
        this.tokenExpiry = new Date(Date.now() + parseInt(data.expires_in) * 1000)
    }

    getAccessToken(): string | null {
        return this.accessToken
    }

    isTokenExpired(): boolean {
        if (!this.tokenExpiry) return true
        return Date.now() >= this.tokenExpiry.getTime()
    }


    async ensureValidToken(): Promise<string> {
        if (!this.accessToken || this.isTokenExpired()) {
            await this.login();
        }
        return this.accessToken!
    }
}

export const authService = AuthService.getInstance()

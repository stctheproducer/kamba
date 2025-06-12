export interface LogtoUserResponse {
  id: string
  nickName: string | null
  name: string | null
  email: string
  emailVerificationState: string
  avatarUrl: string | null
  original: UserBody
  token: Token
}

export interface UserBody {
  sub: string
  name: string | null
  picture: string | null
  updated_at: number
  username: string
  created_at: number
  phone_number: string | null
  phone_number_verified: boolean
  email: string
  email_verified: boolean
  custom_data: Record<string, any>
}

export interface Token {
  token: string
  type: string
  expiresIn: number
  expiresAt: Date
  id_token: string
  scope: string
}

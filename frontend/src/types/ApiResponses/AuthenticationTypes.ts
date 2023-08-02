import { UserType } from "../UserType"

export type SignInType = {
    token: string,
    user: UserType
}

export type CheckTokenType = {
    isValid: boolean,
    user?: UserType
}

export type CheckUserType = {
    isAvailable: true
}

export type CheckEmailType = {
    isAvailable: true
}

export type SignUpType = {
    message: string
}
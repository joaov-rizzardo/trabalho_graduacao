import { UserType } from "../../UserType"

export type CheckTokenType = {
    isValid: boolean,
    user?: UserType
}
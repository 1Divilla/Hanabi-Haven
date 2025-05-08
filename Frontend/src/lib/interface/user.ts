import { StrapiImage } from "./image"

export interface User {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    role: {
        id: number
        name: string
        description: string
        type: string
    }
    avatar: StrapiImage
}
import { StrapiImage } from "./image"
import { Notification } from "./notification"

export interface User {
    id: number
    documentId: string
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
    notifications?: Notification[]
}
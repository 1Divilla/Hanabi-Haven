import { User } from "./user"

export interface Notification {
    id?: number
    title: string
    content: string
    priority: 'low' | 'medium' | 'high'
    isRead: boolean
    users_permissions_user?: User
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
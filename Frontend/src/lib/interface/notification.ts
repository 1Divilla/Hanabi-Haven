import { User } from "./user"

export interface Notification {
    id?: number
    documentId: string
    title: string
    content: string
    priority: 'low' | 'medium' | 'high'
    users_permissions_user?: User
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
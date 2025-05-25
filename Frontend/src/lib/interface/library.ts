import { Book } from "./book"
import { User } from "./user"

export interface Library {
    id?: number
    documentId: string
    bookStatus: 'Completed' | 'Favourite' | 'Abandoned' | 'Reading' | 'Waiting'
    books?: Book[]
    users_permissions_user?: User
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
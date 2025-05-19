import { Book } from "./book"
import { User } from "./user"

export interface Library {
    id?: number
    bookStatus: 'Completed' | 'Favourite' | 'Abandoned' | 'Reading' | 'Waiting'
    books?: Book[]
    users_permissions_user?: User
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
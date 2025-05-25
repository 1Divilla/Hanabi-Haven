import { Chapter } from "./chapter"
import { User } from "./user"
import { Book } from "./book"

export interface History {
    id?: number
    documentId: string
    lastChapter?: number
    users_permissions_user?: User
    chapter?: Chapter
    book?: Book
}
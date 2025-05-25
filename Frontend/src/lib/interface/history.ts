import { Chapter } from "./chapter"
import { User } from "./user"
import { Book } from "./book"
import { Collection } from "./collection"
export interface History extends Collection {
    lastChapter?: number
    users_permissions_user?: User
    chapter?: Chapter
    book?: Book
}
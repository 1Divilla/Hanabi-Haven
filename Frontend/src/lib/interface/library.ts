import { Book } from "./book"
import { User } from "./user"
import { Collection } from "./collection"
export interface Library extends Collection {
    bookStatus: 'Completed' | 'Favourite' | 'Abandoned' | 'Reading' | 'Waiting'
    books?: Book[]
    users_permissions_user?: User
}
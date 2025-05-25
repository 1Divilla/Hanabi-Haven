import { Book } from "./book"

import { Collection } from "./collection"
export interface Genre extends Collection {
    name: string
    description?: string
    books?: Book[]
}
import { Book } from "./book"

export interface Genre {
    id?: number
    name: string
    description?: string
    books?: Book[]
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
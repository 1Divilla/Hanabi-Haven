import { Book } from "./book"
import { StrapiImage } from "./image"
import { Collection } from "./collection"

export interface Chapter extends Collection {
    title: string
    textContent?: string
    imageContent?: StrapiImage[]
    number: number
    book?: Book
    history?: History[]
}
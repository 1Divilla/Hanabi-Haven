import { Book } from "./book"
import { CommentChapter } from "./commentChapter"
import { StrapiImage } from "./image"

export interface Chapter {
    id?: number
    documentId: string
    title: string
    textContent?: string
    imageContent?: StrapiImage[]
    number: number
    book?: Book
    history?: History[]
    comment_chapters?: CommentChapter[]
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
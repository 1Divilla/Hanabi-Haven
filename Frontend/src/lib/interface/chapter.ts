import { Book } from "./book"
import { CommentChapter } from "./commentChapter"
import { StrapiImage } from "./image"

export interface Chapter {
    id?: number
    title: string
    textContent?: string // Contenido en formato markdown
    imageContent?: StrapiImage[] // Array de imágenes para capítulos tipo manga
    number: number
    book?: Book // Relación con el libro al que pertenece
    history?: History[] // Relación con historial de lectura
    comment_chapters?: CommentChapter[] // Relación con comentarios
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
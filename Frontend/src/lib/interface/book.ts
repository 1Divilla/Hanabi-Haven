import { Chapter } from "./chapter"
import { CommentBook } from "./commentBook"
import { Genre } from "./genre"
import { StrapiImage } from "./image"
import { Library } from "./library"

export interface Book {
    id?: number
    title: string
    description: string
    type: 'novel' | 'manga' | 'manhwa' | 'manhua' | 'comic'
    bookStatus: 'ongoing' | 'hiatus' | 'completed' | 'abandoned'
    featured: boolean
    totalViews: number
    weeklyViews: number
    language: 'ES' | 'EN' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'ZH' | 'JA' | 'KO'
    coverImage: StrapiImage
    chapters?: Chapter[]
    comment_books?: CommentBook[]
    genres?: Genre[]
    author: string
    library?: Library
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
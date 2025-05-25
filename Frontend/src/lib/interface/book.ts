import { Chapter } from "./chapter"
import { Genre } from "./genre"
import { StrapiImage } from "./image"
import { Library } from "./library"
import { User } from "./user"
import { Collection } from "./collection"

export interface Book extends Collection {
    title: string
    description: string
    type: 'novel' | 'manga' | 'manhwa' | 'manhua' | 'comic'
    bookStatus: 'ongoing' | 'hiatus' | 'completed' | 'abandoned'
    featured: boolean
    totalViews: number
    language: 'ES' | 'EN' | 'FR' | 'DE' | 'IT' | 'PT' | 'RU' | 'ZH' | 'JA' | 'KO'
    coverImage: StrapiImage
    chapters?: Chapter[]
    genres?: Genre[]
    author: string
    library?: Library
    histories?: History[]
    users_permissions_user: User
}
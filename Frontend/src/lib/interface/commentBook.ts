import { Book } from "./book"
import { CommentReply } from "./commentReply"
import { User } from "./user"

export interface CommentBook {
    id?: number
    book?: Book // Relación con el libro al que pertenece
    content: string // Contenido del comentario
    isApproved: boolean // Corregido de "isAproved" a "isApproved"
    comment_replies?: CommentReply[] // Array de respuestas al comentario
    users_permissions_user?: User // Usuario que hizo el comentario
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
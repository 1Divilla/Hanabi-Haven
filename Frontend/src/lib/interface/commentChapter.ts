import { Chapter } from "./chapter"
import { CommentReply } from "./commentReply"
import { User } from "./user"

export interface CommentChapter {
    id?: number
    documentId: string
    chapter?: Chapter // Relación con el libro al que pertenece
    content: string // Contenido del comentario
    isApproved: boolean // Corregido de "isAproved" a "isApproved"
    comment_reply?: CommentReply[] // Array de respuestas al comentario
    users_permissions_user?: User // Usuario que hizo el comentario
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
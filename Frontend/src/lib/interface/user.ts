import { StrapiImage } from "./image"
import { CommentBook } from "./commentBook"
import { CommentChapter } from "./commentChapter"
import { CommentReply } from "./commentReply"

export interface User {
    id: number
    documentId: string
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    role: {
        id: number
        name: string
        description: string
        type: string
    }
    avatar: StrapiImage
    comment_books?: CommentBook[]
    comment_chapters?: CommentChapter[]
    comment_reply?: CommentReply
}
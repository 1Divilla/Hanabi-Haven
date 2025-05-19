import { User } from "./user"
import { CommentBook } from "./commentBook"
import { CommentChapter } from "./commentChapter"

export interface CommentReply {
    id?: number
    content: string
    isApproved: boolean
    users_permissions_user?: User
    comment_chapter?: CommentChapter
    comment_book?: CommentBook
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
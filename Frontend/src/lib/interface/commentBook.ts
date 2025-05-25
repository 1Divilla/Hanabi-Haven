import { Book } from "./book"
import { CommentReply } from "./commentReply"
import { User } from "./user"

export interface CommentBook {
    id?: number
    book?: Book
    content: string
    isApproved: boolean
    comment_replies?: CommentReply[]
    users_permissions_user?: User
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}
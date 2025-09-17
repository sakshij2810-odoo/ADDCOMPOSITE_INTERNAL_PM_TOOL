import React from 'react'
import { SingleCommentDetails } from './SingleCommentDetails'
import { IComment } from 'src/redux'


interface ICommentsListProps {
    comments: IComment[]
}
export const CommentsList: React.FC<ICommentsListProps> = ({ comments }) => {
    return (
        <div>
            {comments.map((comment, c_idx) => {
                return (
                    <SingleCommentDetails key={c_idx} comment={comment} />
                )
            })}
        </div>
    )
}

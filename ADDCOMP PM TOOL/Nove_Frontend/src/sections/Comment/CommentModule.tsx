import { Divider, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { AddNewCommentFrom } from './compoents/AddNewCommentFrom'
import { defaultComment, fetchMultipleCommentsWithArgsAsync, ICommentModule, IStoreState, useAppDispatch, useAppSelector } from 'src/redux';
import { CommentsList } from './compoents/CommentsList';


export interface ICommentModuleProps {
    module_uuid: string
    module_name: ICommentModule
}

export const CommentModule: React.FC<ICommentModuleProps> = ({
    module_uuid, module_name
}) => {

    const dispatch = useAppDispatch();

    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.comments.all_comments);


    useEffect(() => {
        if (!module_uuid) return
        dispatch(fetchMultipleCommentsWithArgsAsync(module_uuid))
    }, [module_uuid])




    return (
        <div>
            <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
                <Typography variant="h4">Comments</Typography>
                {/* <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                    ({post?.comments.length})
                </Typography> */}
            </Stack>

            <AddNewCommentFrom module_uuid={module_uuid} module_name={module_name} />
            {multipleDataArray.length > 0 && <Divider sx={{ mt: 5, mb: 2 }} />}

            <CommentsList comments={multipleDataArray} />
        </div>
    )
}

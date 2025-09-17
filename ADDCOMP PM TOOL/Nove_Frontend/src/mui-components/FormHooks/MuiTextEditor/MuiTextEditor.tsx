import React from 'react'
import { Editor, EditorProps } from './editor';


export const MuiTextEditor: React.FC<EditorProps> = (props) => {
    return (
        <Editor  {...props} />
    );
}

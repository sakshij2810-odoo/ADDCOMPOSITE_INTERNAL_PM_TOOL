/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-return-assign */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import juice from 'juice';
import { Editor as TinymceEditor } from '@tinymce/tinymce-react';
import { IEditorProps } from './Editor.types';

export const TemplateEditor: React.FC<IEditorProps> = ({ content, onChange }) => {
  const editorRef = React.useRef<TinymceEditor | null>(null);

  const processHtmlForEmail = (htmlContent: any) => {
    // Inline CSS styles and clean up the HTML
    const inlinedHtml = juice(htmlContent);
    return inlinedHtml;
  };

  const handleEditorChange = (newContent: any) => {
    if (typeof newContent !== 'string') {
      console.error('Content is not a string:', newContent);
      return;
    }

    const processedContent = processHtmlForEmail(newContent);
    onChange(processedContent);
  };

  return (
    <>
      {/* <p>hello</p> */}
      <TinymceEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        // @ts-ignore
        onInit={(_evt, editor) => ((editorRef.current as any) = editor)}
        value={content}
        init={{
          height: 500,
          menubar: false,
          plugins: 'lists link image code',
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | forecolor | image | link anchor',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          forced_root_block: 'p', // Ensures paragraphs are used instead of divs
          link_context_toolbar: true,
        }}
        onEditorChange={handleEditorChange}
      />
    </>
  );
};

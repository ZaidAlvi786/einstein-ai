import React, { useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { Box, Text } from '@mantine/core';
import {
  FlipBackwardIcon,
  WysiwygBoldIcon,
  WysiwygBulletListIcon,
  WysiwygItalicIcon,
  WysiwygLinkIcon,
  WysiwygOrderedListIcon,
} from '@assets/iconComponents';
import { useTextEditor } from './useTextEditor';

interface TextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ initialContent, onContentChange }) => {
  const { editor, currentContentLength, handleReset, MAX_CONTENT_LENGTH } =
    useTextEditor(initialContent);

  useEffect(() => {
    if (editor) onContentChange(editor.getHTML());
  }, [editor?.getHTML()]);

  return (
    <RichTextEditor
      editor={editor}
      classNames={{
        root: 'border-0',
        control: 'border-none',
        toolbar: 'border-none text-gray-400',
      }}
    >
      <RichTextEditor.Toolbar
        sticky
        stickyOffset={60}
        className="flex justify-between items-center"
      >
        <Box className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <FlipBackwardIcon />
          <Text className="font-semibold text-sm text-Brand-700">Reset to Default</Text>
        </Box>
        <RichTextEditor.ControlsGroup className="gap-1">
          <RichTextEditor.Bold icon={WysiwygBoldIcon} />
          <RichTextEditor.Italic icon={WysiwygItalicIcon} />
          <RichTextEditor.Link icon={WysiwygLinkIcon} />
          <RichTextEditor.BulletList icon={WysiwygBulletListIcon} />
          <RichTextEditor.OrderedList icon={WysiwygOrderedListIcon} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content className="border border-solid border-gray-300 font-normal text-lg leading-6 text-gray-500" />
      <Box className="text-sm leading-5 text-gray-600 p-2">
        {`${MAX_CONTENT_LENGTH - currentContentLength} characters left`}
      </Box>
    </RichTextEditor>
  );
};

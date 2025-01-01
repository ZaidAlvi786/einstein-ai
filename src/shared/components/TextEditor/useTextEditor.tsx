import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Link } from '@mantine/tiptap';

const MAX_CONTENT_LENGTH = 1000;

const getPlainTextLength = (html: string | undefined): number => {
  if (!html) return 0;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.length ?? 0;
};

const trimTextContent = (html: string, maxLength: number): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  let currentLength = 0;
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);

  let node;
  while ((node = walker.nextNode())) {
    const textContent = node.textContent || '';
    const textLength = textContent.length;

    if (currentLength + textLength > maxLength) {
      node.textContent = textContent.slice(0, maxLength - currentLength);
      break;
    }
    currentLength += textLength;
  }
  return tempDiv.innerHTML;
};

export const useTextEditor = (initialContent: string) => {
  const [currentContent, setCurrentContent] = useState<string>(initialContent);
  const [currentContentLength, setCurrentContentLength] = useState<number>(MAX_CONTENT_LENGTH);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const length = getPlainTextLength(html);
      if (length > MAX_CONTENT_LENGTH) {
        const trimmedHTML = trimTextContent(html, MAX_CONTENT_LENGTH);
        editor.commands.setContent(trimmedHTML);
      }
      setCurrentContentLength(getPlainTextLength(editor.getHTML()));
    },
  });

  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      setCurrentContent(html);
      setCurrentContentLength(getPlainTextLength(html));
    }
  }, [editor]);

  const handleReset = () => {
    if (editor) {
      editor.commands.setContent(initialContent);
      setCurrentContentLength(getPlainTextLength(initialContent));
    }
  };

  return {
    editor,
    currentContent,
    currentContentLength,
    handleReset,
    MAX_CONTENT_LENGTH,
  };
};

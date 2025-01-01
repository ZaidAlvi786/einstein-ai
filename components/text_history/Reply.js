"use client"

import { useMemo, useCallback } from "react";

const TextSelectorok = ({ children, setReplyText, msgIndex, ReRenderChildren }) => {

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      setReplyText(selectedText, msgIndex);
    } else {
      setReplyText("", null);
    }
  }, []);

  const memoChildren = useMemo(() => children, [ReRenderChildren]);

  return (<>
    <span onMouseUp={handleTextSelection} className="text-container relative">
      {memoChildren}
    </span>
  </>);
};

export default TextSelectorok;
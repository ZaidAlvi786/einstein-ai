import { useAppSelector } from "@/app/lib/hooks";
import { Image, Input, Tooltip } from "@nextui-org/react";
import React, { useState, useRef, useEffect } from "react";
import Callout from "./Callout";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

const TextEditor: React.FC<{
  value: string;
  setValue: (val: string) => void;
  activeChatModel: any;
  onKeyDown: any;
  editorRef: any;
  isEdit: boolean;
}> = ({ value, setValue, activeChatModel, onKeyDown, editorRef, isEdit }) => {
  const activeChat = useAppSelector((state: any) => state.chat.activeChat);
  const [editorVisible, setEditorVisible] = useState(false);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [showCallout, setShowCallout] = useState(false);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      setTimeout(() => {
        const selection: any = window.getSelection();
        // if (!selection || selection.toString().trim() === "") {
        //   setEditorVisible(false);
        //   return;
        // }

        // Ensure selection is inside the editor
        if (
          editorRef.current &&
          editorRef.current.contains(selection.anchorNode)
        ) {
          handleSelection();
        } else {
          setEditorVisible(false); // Hide if selection is outside
        }
      }, 0); // Ensure selection updates before checking
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);


  useEffect(() => {
    if (!activeChat?.id) {
      if (editorRef.current) {
        editorRef.current.innerHTML = ""; // clear the input on new chat
        setIsPlaceholderVisible(true);
        setValue("");
      }
    }
  }, [activeChat]);

  useEffect(() => {
    if (value.length === 0 || editorRef.current?.innerHTML.length === 0) {
      setIsPlaceholderVisible(true);
    } else {
      setIsPlaceholderVisible(false);
    }
    // setEditorVisible(false); // hide if editor is showing and typing
  }, [value, editorRef]);

 

  const handleSelection = () => {
    const selection: any = window.getSelection();
    // if (!selection || selection.rangeCount === 0) {
    //   setEditorVisible(false);
    //   return;
    // }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (selection.toString().trim().length > 0) {
      setEditorVisible(true);
    } else {
      // setEditorVisible(false);
    }
  };

  const toggleHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;

      if (
        parentElement &&
        parentElement.tagName === "SPAN" &&
        parentElement.style.backgroundColor === "white"
      ) {
        // If already highlighted, remove highlight
        const parent = parentElement.parentNode;
        while (parentElement.firstChild) {
          parent?.insertBefore(parentElement.firstChild, parentElement);
        }
        parent?.removeChild(parentElement);
      } else {
        // If not highlighted, apply highlight
        const span = document.createElement("span");
        span.style.backgroundColor = "white";
        span.style.color = "black";
        span.style.borderRadius = "3px";
        range.surroundContents(span);
      }

      setValue(editorRef.current?.innerHTML || "");
      setIsPlaceholderVisible(editorRef.current?.innerHTML === ""); // Check if empty
      setEditorVisible(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Apply formatting commands
  const applyStyle = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    setEditorVisible(false); // Hide after applying style
    setValue(editorRef.current?.innerHTML || ""); // Store modified text
    setIsPlaceholderVisible(editorRef.current?.innerHTML === ""); // Check if empty
  };

  // Update state when content changes
  const handleInput = () => {
    let content = editorRef.current?.innerHTML || "";
    if (content === "<br>" || content === "<div><br></div>") {
      content = "";
    }
    setValue(content);
    setIsPlaceholderVisible(content === ""); // Show placeholder if empty
  };

  const applyCodeBlock = () => {
    if (!editorRef.current) return;
  
    const selection = window.getSelection();
    if (!selection) return;
  
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    let parentElement = range ? range.commonAncestorContainer.parentElement : null;
  
    //  If inside <code>, move cursor outside when clicking outside
    if (parentElement?.tagName === "CODE") {
  
      //  Create a new text node outside the <code> block
      const newNode = document.createTextNode("\u00A0"); // Non-breaking space
      parentElement.parentNode?.insertBefore(newNode, parentElement.nextSibling);
  
      //  Move cursor outside the <code> block
      const newRange = document.createRange();
      newRange.setStartAfter(newNode); // Move cursor after <code>
      newRange.collapse(true);
  
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
  
      //  Create a new <code> tag
      const codeTag = document.createElement("code");
      codeTag.style.cssText = `
        background: #e0e0e024;  
        color:#e8912d
       
      `;
  
      if (range && !selection.isCollapsed) {
        //  If text is selected, wrap it inside <code>
        try {
          range.surroundContents(codeTag);
        } catch (error) {
          const extractedContents = range.extractContents();
          codeTag.appendChild(extractedContents);
          range.insertNode(codeTag);
        }
      } else {
        //  If no text is selected, create an empty <code> block
        const spaceNode = document.createTextNode("\u00A0"); // Non-breaking space
        codeTag.appendChild(spaceNode);
  
        if (range) {
          range.insertNode(codeTag);
        } else {
          editorRef.current.appendChild(codeTag);
        }
  
        //  Move cursor inside the <code> block
        const newRange = document.createRange();
        newRange.setStart(codeTag, 1); // Move cursor inside <code>
        newRange.collapse(true);
  
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  
    //  Update React state immediately after applying changes
    setTimeout(() => {
      setValue(editorRef.current?.innerHTML || "");
      setIsPlaceholderVisible(editorRef.current?.innerHTML === "");
      setEditorVisible(false);
    }, 0);
  };
  
  //  Listen for clicks outside of the code block
  const handleClickOutsideCode = (event: MouseEvent) => {
    if (!editorRef.current) return;
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
    let parentElement = range.commonAncestorContainer.parentElement;
  
    if (parentElement?.tagName === "CODE") {
  
      //  Move cursor outside the <code> tag
      const newNode = document.createTextNode("\u00A0");
      parentElement.parentNode?.insertBefore(newNode, parentElement.nextSibling);
  
      const newRange = document.createRange();
      newRange.setStartAfter(newNode);
      newRange.collapse(true);
  
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };
  
  //  Attach event listener to detect clicks outside the <code> block
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideCode);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCode);
    };
  }, []);
  

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "/") {
      // event.preventDefault();

      // Check if user typed "//" (double slash)
      if (editorRef.current?.innerText.endsWith("/")) {
        setShowCallout(false); // Hide callout if double slash is typed
        if (editorRef.current.lastChild?.nodeName === "BLOCKQUOTE") {
          // Append a new div for text input
          const newDiv = document.createElement("div");
          newDiv.innerHTML = "<br>"; // Empty div for writing outside
          editorRef.current.appendChild(newDiv);

          // Move cursor to new div
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(newDiv, 0);
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        return;
      }
      setCalloutPosition({
        top: 0,
        left: 0,
      });
      setShowCallout(true);
    } else {
      setShowCallout(false);
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new lines without Shift
      onKeyDown(event); // Call parent function

      // Clear text after pressing Enter
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setValue(""); // Update React state
    }
  };

  const applyColor = (color: string, type: "text" | "background") => {
    if (type === "text") {
      document.execCommand("foreColor", false, color);
      setTextColor(color);
    } else {
      document.execCommand("hiliteColor", false, color);
      setBgColor(color);
    }
    // setEditorVisible(false);
    setValue(editorRef.current?.innerHTML || "");
  };

//  Escape from background color when clicking outside
const handleClickOutsideBgColor = (event: MouseEvent) => {
  if (!editorRef.current) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  let parentElement = range.commonAncestorContainer.parentElement;

  //  If inside a highlighted <span>, move cursor outside
  if (parentElement?.style.backgroundColor && parentElement.style.backgroundColor !== "transparent") {

    //  Create a new empty text node outside the highlight
    const newNode = document.createTextNode("\u00A0");
    parentElement.parentNode?.insertBefore(newNode, parentElement.nextSibling);

    const newRange = document.createRange();
    newRange.setStartAfter(newNode);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};

//  Attach event listener to detect clicks outside highlighted text
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutsideBgColor);
  return () => {
    document.removeEventListener("mousedown", handleClickOutsideBgColor);
  };
}, []);


  const applyQuoteBlock = (e: any) => {
    e.preventDefault();

    if (!editorRef.current) return;

    const editor = editorRef.current;
    let existingBlockquote = editor.querySelector("blockquote");

    if (existingBlockquote) {
      // Remove <blockquote> while keeping the inner content
      const parent = existingBlockquote.parentNode;
      if (parent) {
        while (existingBlockquote.firstChild) {
          parent.insertBefore(
            existingBlockquote.firstChild,
            existingBlockquote
          );
        }
        parent.removeChild(existingBlockquote);
      }
    } else {
      // Wrap the entire editor content inside <blockquote>
      const blockquote = document.createElement("blockquote");
      blockquote.style.borderLeft = "3px solid #c8c8c8";
      blockquote.style.padding = "0px";
      blockquote.style.paddingRight = "10px";
      blockquote.style.paddingLeft = "10px";
      blockquote.style.paddingBottom = "4px";
      blockquote.style.margin = "10px 0";
      blockquote.style.color = "#c8c8c8";
      blockquote.style.fontStyle = "italic";
      blockquote.style.display = "block";
      blockquote.innerHTML = editor.innerHTML || "<br>"; // Ensure there's some space to type
      editor.innerHTML = ""; // Clear editor before appending blockquote
      editor.appendChild(blockquote);
      
      // Move cursor inside the blockquote
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(blockquote); // Selects the blockquote contents
      range.collapse(false); // Move cursor to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Ensure keyboard focus is inside the editor
      blockquote.focus();
    }

    // Update state with new content
    setValue(editor.innerHTML);
    setIsPlaceholderVisible(editor.innerHTML === ""); // Show placeholder if empty
    setEditorVisible(false);
  };

  const handleClickOutsideQuote = (event: MouseEvent) => {
    if (!editorRef.current) return;

    const blockquote = editorRef.current.querySelector("blockquote");

    if (blockquote && !blockquote.contains(event.target as Node)) {
      // Ensure there's a div to type into if not already present
      if (
        !editorRef.current.lastChild ||
        editorRef.current.lastChild.nodeName !== "DIV"
      ) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = "<br>"; // Empty div for new text
        editorRef.current.appendChild(newDiv);
      }
    }
  };

    // add extra line below blockquote
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutsideQuote);
      return () => {
        document.removeEventListener("mousedown", handleClickOutsideQuote);
      };
    }, []);

  return (
    <div style={{ width: "-webkit-fill-available", position: "relative" }}>
      {isPlaceholderVisible && !isEdit && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none", // Prevent interaction
            color: "#aaa", // Light gray color
            padding: "10px",
          }}
        >
          {`Message ${activeChatModel?.name || ""}`}
        </div>
      )}

      <div
        onDoubleClick={() => {
          setEditorVisible(true);
        }}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onInput={handleInput}
        onKeyDown={handleEditorKeyDown} // Call parent function
        onClick={() => setEditorVisible(false)}
        style={{
          minHeight: "35px",
          maxHeight: "216.75px",
          overflowY: "auto",
          padding: "10px",
          borderRadius: "5px",
          cursor: "text",
          outline: "none",
          color: "white",
          background: "transparent",
          width: "100%",
        }}
        className={`${isEdit ? "!pr-[25px] text-end" : "max-w-[576px]"}`}
        onPaste={(event) => {
          event.preventDefault(); // Prevent default paste behavior

          // Get plain text from clipboard
          const text = event.clipboardData.getData("text/plain");

          // Insert text at cursor position
          document.execCommand("insertText", false, text);
        }}
      />
      <Callout
        showCallout={showCallout}
        calloutPosition={calloutPosition}
        setCalloutPosition={setCalloutPosition}
        setShowCallout={setShowCallout}
        setValue={setValue}
        editorRef={editorRef}
      />

      {editorVisible && (
        <div
          style={{
            position: "absolute",
            // top: `${editorPosition.top - 350}px`,
            // left: `${editorPosition.left - 835}px`,
            top: `-50px`,
            left: `0px`,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "5px",
            display: "flex",
            gap: "5px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <Tooltip
            placement="top"
            content={"Bold"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button className="px-1 mx-0.5" onClick={() => applyStyle("bold")}>
              <b>B</b>
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Italic"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onClick={() => applyStyle("italic")}
            >
              <i>I</i>
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Underline"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onClick={() => applyStyle("underline")}
            >
              <u>U</u>
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Strike Through"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onClick={() => applyStyle("strikeThrough")}
            >
              <s>S</s>
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Code"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onClick={applyCodeBlock}
              style={{ fontFamily: "monospace" }}
            >
              <CodeBracketIcon className="w-5 h-5 text-[#000]" />
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Highlight"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onClick={toggleHighlight}
              style={{ background: "black", color: "white", fontSize: "12px" }}
            >
              Highlight
            </button>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Text Color"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
              onClick={() => colorInputRef.current?.click()} // Open color picker on div click
            >
              {/* Hidden Native Color Input */}
              <input
                type="color"
                ref={colorInputRef}
                value={textColor}
                onChange={(e) => applyColor(e.target.value, "text")}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0, // Hide input but keep it functional
                  cursor: "pointer",
                  border: "none",
                }}
              />

              {/* "A" Overlay Text - Clicks Now Work */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                  pointerEvents: "none", // Ensures click goes through to the div
                  zIndex: 2, // Makes sure it stays on top
                  borderBottom: `5px solid ${textColor}`,
                  width: "25px",
                  textAlign: "center",
                }}
              >
                A
              </div>
            </div>
          </Tooltip>
          <Tooltip
            placement="top"
            content={"Background Color"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <input
              type="color"
              value={bgColor}
              onChange={(e) => applyColor(e.target.value, "background")}
              style={{ width: "30px", height: "30px", border: "none" }}
            />
          </Tooltip>

          <Tooltip
            placement="top"
            content={"Quote"}
            classNames={{
              content: ["mx-6 mb-2 py-2 px-0 text-white bg-[#272727]"],
            }}
            delay={0}
            closeDelay={0}
          >
            <button
              className="px-1 mx-0.5"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents any unwanted focus issues
                e.stopPropagation(); // Stops event from bubbling up
                applyQuoteBlock(e);
              }}
              style={{
                fontStyle: "italic",
                paddingLeft: "5px",
              }}
            >
              <Image src="/icons/quoteIcon.png" width={16} height={16} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default TextEditor;

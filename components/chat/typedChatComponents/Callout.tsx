import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";

const CALLS = ["Note", "Warning", "Tip"];

const calloutStyles: {
  [key: string]: { background: string; border: string; labelColor: string };
} = {
  Note: {
    background: "#e0f7fa",
    border: "1px solid #007bff",
    labelColor: "#007bff",
  }, // Light blue
  Warning: {
    background: "#fff3cd",
    border: "1px solid #ff9800",
    labelColor: "#ff9800",
  }, // Light yellow
  Tip: {
    background: "#d4edda",
    border: "1px solid #28a745",
    labelColor: "#28a745",
  }, // Light green
};

const Callout = ({
  showCallout,
  calloutPosition,
  setCalloutPosition,
  setShowCallout,
  setValue,
  editorRef,
}: any) => {
  const outSideRef: any = useRef(null);
  useEffect(() => {
    // Function to handle clicks outside the div
    function handleClickOutside(event: any) {
      if (outSideRef.current && !outSideRef.current.contains(event.target)) {
        setShowCallout(false);
      }
    }

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to handle callout removal
    const handleCalloutRemove = (event: any) => {
      const target = event.target;
      if (target.classList.contains("callout-remove-icon")) {
        const calloutId = target.getAttribute("data-callout-id");
        if (calloutId) {
          const calloutElement = document.getElementById(calloutId);
          if (calloutElement) {
            calloutElement.remove();
            setValue(editorRef.current?.innerHTML || "");
          }
        }
      }
    };
  
    // Add event listener for callout removal
    document.addEventListener("click", handleCalloutRemove);
  
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleCalloutRemove);
    };
  }, []);
  

  const handleCalloutSelection = (callout: string) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (!range) return;
  
    // Move back to remove the `/` before inserting the callout
    range.setStart(range.startContainer, range.startOffset - 1);
    range.deleteContents(); // Delete the `/`
  
    // Generate a unique ID
    const calloutId = `callout-${Date.now()}`;
  
    // Create the callout wrapper div
    const calloutDiv = document.createElement("div");
    calloutDiv.id = calloutId; // Assign unique ID
    calloutDiv.setAttribute("data-callout-id", calloutId);
    calloutDiv.style.backgroundColor = calloutStyles[callout].background;
    calloutDiv.style.border = calloutStyles[callout].border;
    calloutDiv.style.padding = "8px";
    calloutDiv.style.borderRadius = "5px";
    calloutDiv.style.margin = "8px 0";
    calloutDiv.style.minHeight = "40px";
    calloutDiv.style.display = "flex";
    calloutDiv.style.alignItems = "center";
    calloutDiv.style.gap = "8px";
    calloutDiv.style.position = "relative";
    calloutDiv.style.cursor = "text";
    calloutDiv.contentEditable = "false"; // Prevent full div from being editable
    calloutDiv.style.maxWidth = "576px";
    calloutDiv.className = "calloutDiv"
    calloutDiv.style.marginLeft = "auto";
  
    // Create callout label
    const labelSpan = document.createElement("span");
    labelSpan.textContent = `${callout}: `;
    labelSpan.classList.add("callout-label");
    labelSpan.style.fontWeight = "bold";
    labelSpan.style.cursor = "pointer";
    labelSpan.style.marginRight = "5px";
    labelSpan.style.userSelect = "none";
    labelSpan.style.padding = "2px";
    labelSpan.style.borderRadius = "4px";
    labelSpan.style.minWidth = "50px";
    labelSpan.style.display = "inline-block";
    labelSpan.style.color = calloutStyles[callout].labelColor;
  
    // Create a content area inside the callout
    const contentSpan = document.createElement("span");
    contentSpan.textContent = "";
    contentSpan.contentEditable = "true";
    contentSpan.style.flex = "1";
    contentSpan.style.cursor = "text";
    contentSpan.style.border = "none";
    contentSpan.style.outline = "none";
    contentSpan.style.color = "black";
    contentSpan.style.cursor = "text";
    contentSpan.style.minWidth = "400px";
    contentSpan.style.paddingRight = "15px";
  
    // Create a remove button
    const removeButton = document.createElement("button");
    removeButton.setAttribute("data-callout-id", calloutId); // Add callout ID as a data attribute
    removeButton.textContent = "×";
    removeButton.style.position = "absolute";
    removeButton.style.top = "8px";
    removeButton.style.right = "8px";
    removeButton.style.border = "none";
    removeButton.className = "callout-remove-icon";
    removeButton.style.background = "transparent";
    removeButton.style.border = "none";
    removeButton.style.color = calloutStyles[callout].labelColor;
    removeButton.style.fontSize = "16px";
    removeButton.style.cursor = "pointer";
    removeButton.style.fontWeight = "bold";
  
    // Append elements to the callout
    calloutDiv.appendChild(labelSpan);
    calloutDiv.appendChild(contentSpan);
    calloutDiv.appendChild(removeButton);
  
    // Insert the callout into the editor
    range.insertNode(calloutDiv);
  
    // Insert placeholder after callout so users can type outside
    const placeholder = document.createElement("div");
    placeholder.innerHTML = "<br>"; // New line
    placeholder.contentEditable = "true";
    placeholder.style.minHeight = "20px";
    placeholder.style.cursor = "text";
    placeholder.style.display = "block";
    placeholder.style.outline = "none";
    calloutDiv.insertAdjacentElement("afterend", placeholder);
  
    setShowCallout(false);
    setValue(editorRef.current?.innerHTML || "");
  
    // Move cursor inside the placeholder
    setTimeout(() => {
      const newRange = document.createRange();
      newRange.selectNodeContents(placeholder);
      newRange.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
      contentSpan.focus();
    }, 0);
  };
  
  return (
    <div>
      {showCallout && (
        <div
          ref={outSideRef}
          style={{
            position: "absolute",
            top: `${calloutPosition.top - 162}px`,
            left: `${calloutPosition.left - 0}px`,
            background: "#333",
            // border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px 10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            color: "black",
          }}
        >
          {CALLS.map((call, index) => (
            <button
              key={index}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                padding: "10px 30px 10px 10px",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              className="flex items-center gap-2 callout-option"
              onClick={() => handleCalloutSelection(call)}
            >
              {call === "Warning" ? (
                <ExclamationTriangleIcon width={23} height={23} />
              ) : call === "Note" ? (
                <InformationCircleIcon width={23} height={23} />
              ) : call === "Tip" ? (
                <LightBulbIcon width={23} height={23} />
              ) : (
                ""
              )}
              {call}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Callout;

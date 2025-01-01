import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { dracula, CopyBlock } from "react-code-blocks";
import TextSelectorok from "../text_history/Reply";

const ReactMarkDown = ({ data, highlightedText = "", highlightedTextColor = "" }) => {
  // let contentBlocks = data.split('\n\n');
  // data = contentBlocks.map(block => block.replace('\n', '')).join('\n');
  const onSetReplyText = (text) => {
  };

  const childHighlightedText = (child, highlightedText) => {
    if (child?.toLowerCase()?.includes(highlightedText?.toLowerCase())) {
      const parts = child?.split(new RegExp(`(${highlightedText})`, "gi"));
      return parts?.map((part, index) =>
        part?.toLowerCase() === highlightedText?.toLowerCase() ? (
          <span style={{ backgroundColor: highlightedTextColor ?? "yellow" }}>{part}</span>
        ) : (
          part
        )
      );
    } else {
      return child;
    }
  };

  function highlightText(child, highlightedText) {
    // console.log("highlight text", highlightedText);
    if (highlightedText !== "" && highlightedText !== null) {
      if (typeof child === "string") {
        return childHighlightedText(child, highlightedText);
      } else if (typeof child === "object") {
        const child1 = child?.props?.children;
        if (typeof child1 === "string") {
          return childHighlightedText(child1, highlightedText);
        } else if (typeof child1 === "object") {
          // console.log(" child.length:", child.length);
          // console.log(" child1:", child1);
          // console.log(" child1.length:", child1.length);
          // console.log(" typeof child1:", typeof child1);
          if (child1?.length !== undefined && child1?.length > 0) {
            child1?.map((child2) => {
              if (typeof child2 == "string") {
                return childHighlightedText(child2, highlightedText);
              } else if (typeof child2 == "object") {
                const child3 = child?.props?.children;
                // console.log("type of child3", typeof child3);
                // console.log("child3", child3);
                child3?.map((child4) => {
                  if (typeof child4 == "string") {
                    return childHighlightedText(child4, highlightedText);
                  } else if (typeof child4 == "object") {
                    const child5 = child4?.props?.children;

                    if (typeof child5 == "string") {
                      return childHighlightedText(child5, highlightedText);
                    } else if (typeof child5 == "object") {
                      if (Array.isArray(child5 ?? "")) {
                        child5?.map((child6) => {
                          if (typeof child6 == "string") {
                            return childHighlightedText(child6, highlightedText);
                          } else if (typeof child6 == "object") {
                            const child7 = child6?.props?.children;
                            if (typeof child7 == "string") {
                              return childHighlightedText(child7, highlightedText);
                            } else if (typeof child7 == "object") {
                              return childHighlightedText(child7?.props?.childern, highlightedText);
                            }
                          }
                        });
                      }
                    }
                  }
                });
              }
            });
          }
        }
      }
    }

    return child;
  }

  const customComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      if (!inline && match) {
        return (
          <CopyBlock
            text={String(children)}
            language={match[1]}
            showLineNumbers={false}
            wrapLongLines
            theme={dracula}
            {...props}
          />
        );
      }
      return (
        <code className={className} {...props} style={{ color: 'white' }}>
          {highlightText(String(children))}
        </code>
      );
    },
    table({ children, ...props }) {
      return <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif", fontSize: "14px" }} {...props}>{children}</table>;
    },
    tr({ children, ...props }) {
      return <tr style={{ color: 'white', marginTop: "4px" }} {...props}>{children}</tr>;
    },
    h3({ children, ...props }) {
      return <h3 className="text-[17px] text-[#E4E4E4] font-helvetica font-normal my-2.5" {...props}>{highlightText(children)}</h3>;
    },
    td({ children, ...props }) {
      return <td style={{ padding: "8px", border: "1px solid #2F2F2F" }} {...props}>{highlightText(children)}</td>;
    },
    th({ children, ...props }) {
      return <th style={{ padding: "8px", border: "1px solid #2F2F2F", fontWeight: "bold", textAlign: "left" }} {...props}>{highlightText(children)}</th>;
    },
    a({ href, children, ...props }) {
      return (
        <a style={{ color: "#007BFF", textDecoration: "none" }} href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {highlightText(children)}
        </a>
      );
    },
    p({ children, ...props }) {
      return (
        <div className="text-[17px] text-[#E4E4E4] font-helvetica font-normal break-words leading-7" {...props} style={{ whiteSpace: "pre-wrap" }}>
          {highlightText(children)}
        </div>
      );
    },
    ol({ children, ...props }) {
      return <ol style={{ listStyleType: "number", paddingLeft: "21px" }} className="text-[17px] text-[#E4E4E4] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]" {...props}>{children}</ol>;
    },
    ul({ children, ...props }) {
      return <ul style={{ listStyleType: "disc", paddingLeft: "21px" }} className="text-[17px] text-[#E4E4E4] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]" {...props}>{children}</ul>;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax, rehypeRaw]}
      className="user-prompt"
      components={customComponents}
    >
      {data}
    </ReactMarkdown>
  );
};
export default ReactMarkDown;
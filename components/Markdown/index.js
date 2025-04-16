import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import CopyIcon from "@/app/assets/svg/Icon-copy.svg";
import { CheckIcon } from "@heroicons/react/24/outline";
import { dracula, CopyBlock } from "react-code-blocks";
import Prism from "prismjs";
import "prismjs/components/index.js"; // Import JSX language component
import "prismjs/themes/prism-twilight.css"; // Include Prism theme
import "prismjs/components/prism-jsx.min.js"; // Import JSX language component
import "prismjs/components/prism-c.min.js"; // Import JSX language component
import "prismjs/components/prism-cpp.min.js"; // Import JSX language component
import "prismjs/components/prism-python"; // Import JSX language component
import "prismjs/components/prism-ruby"; // Import JSX language component
import "prismjs/components/prism-java"; // Import JSX language component
import "prismjs/components/prism-csharp"; // Import JSX language component
import "prismjs/components/prism-css"; // Import JSX language component
import "prismjs/components/prism-scss"; // Import JSX language component
import "prismjs/components/prism-typescript";
import { Button, Image, Tooltip } from "@nextui-org/react";
import ViewImagePopup from "../chat/typedChatComponents/ViewImagePopup";
import ImageDownload from "../chat/typedChatComponents/ImageDownload";
import remarkDirective from "remark-directive";

const ReactMarkDown = ({
  data,
  highlightedText = "",
  highlightedTextColor = "",
  handleTextSelection,
  openExportModel,
}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [audioUrls, setAudioUrls] = useState([]);
  const [cleanedData, setCleanedData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [HoveredImg, setHoveredImg] = useState(null);

  // useEffect(() => {
  //   // Define regex for image URLs
  //   const imageRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/g;

  //   // Extract image URLs
  //   if (typeof data !== "string") return;
  //   const extractedUrls = data
  //     ?.split(":,")
  //     ?.map((url) => url.trim().match(imageRegex)?.[0])
  //     ?.filter(Boolean); // Remove null/undefined matches

  //   // Remove image URLs from data
  //   const cleanedText = data.replace(imageRegex, "").replace(/,+/g, ",").trim();

  //   setImageUrls(extractedUrls);
  //   setCleanedData(cleanedText);
  // }, [data]);

  useEffect(() => {
    if (typeof data !== "string") return;

    const underlinedText = data.replace(/__(.*?)__/g, "<u>$1</u>");

    // Define regex for image URLs
    const imageRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/g;
    const audioRegex = /(https?:\/\/[^\s]+\.(?:mp3|wav|ogg))/g;

    // Extract image URLs
    const extractedUrls = underlinedText
      .split(":,")
      .map((url) => url.trim().match(imageRegex)?.[0])
      .filter(Boolean); // Remove null/undefined matches

    // Extract audio URLs
    const extractedAudioUrls = underlinedText
      .split(":,")
      .map((url) => url.trim().match(audioRegex)?.[0])
      .filter(Boolean); // Remove null/undefined matches

    // Remove image and audio URLs from data
    const cleanedText = underlinedText
      .replace(imageRegex, "")
      .replace(audioRegex, "")
      .replace(/,+/g, ",")
      .trim();

    setImageUrls(extractedUrls);
    setAudioUrls(extractedAudioUrls);
    setCleanedData(cleanedText);
  }, [data]);

  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const childHighlightedText = (child, highlightedText) => {
    if (child?.toLowerCase()?.includes(highlightedText?.toLowerCase())) {
      const parts = child?.split(new RegExp(`(${highlightedText})`, "gi"));
      return parts?.map((part, index) =>
        part?.toLowerCase() === highlightedText?.toLowerCase() ? (
          <span style={{ backgroundColor: highlightedTextColor ?? "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      );
    } else {
      return child;
    }
  };

  function highlightText(child, highlightedText) {
    if (highlightedText !== "" && highlightedText !== null) {
      if (typeof child === "string") {
        return childHighlightedText(child, highlightedText);
      } else if (typeof child === "object") {
        const child1 = child?.props?.children;
        if (typeof child1 === "string") {
          return childHighlightedText(child1, highlightedText);
        } else if (typeof child1 === "object") {
          if (child1?.length !== undefined && child1?.length > 0) {
            child1?.map((child2) => {
              if (typeof child2 == "string") {
                return childHighlightedText(child2, highlightedText);
              } else if (typeof child2 == "object") {
                const child3 = child?.props?.children;
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
                            return childHighlightedText(
                              child6,
                              highlightedText
                            );
                          } else if (typeof child6 == "object") {
                            const child7 = child6?.props?.children;
                            if (typeof child7 == "string") {
                              return childHighlightedText(
                                child7,
                                highlightedText
                              );
                            } else if (typeof child7 == "object") {
                              return childHighlightedText(
                                child7?.props?.childern,
                                highlightedText
                              );
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

  const extractDomain = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", ""); // Remove 'www.' for a cleaner look
    } catch (error) {
      return url; // Fallback if URL is invalid
    }
  };

  const customComponents = useMemo(() => {
    let isSummarySection = false;
    return {
      code({ inline, className, children, ...props }) {
        const [copySuccess, setCopySuccess] = useState("Copy code");
        const match = /language-(\w+)/.exec(className || "");
        const language = match ? match[1] : "jsx"; // Get the language from the className

        const codeString = String(children).trim();

        const highlightedCode = (codeString, language) => {
          try {
            return Prism.highlight(
              codeString,
              Prism.languages[language],
              language
            );
          } catch (error) {
            console.warn(`Language not supported by Prism: ${language}`, error);
            return codeString; // Fallback: return plain text if highlighting fails
          }
        };

        const handleCopy = async (textToCopy) => {
          try {
            await navigator.clipboard.writeText(textToCopy);
            setCopySuccess("Copied!"); // Show success message
            setTimeout(() => setCopySuccess("Copy code"), 2000); // Clear message after 2 seconds
          } catch (err) {
            console.log("err: ", err);
          }
        };
        if (!inline && match) {
          return (
            <div className="relative mt-5 mb-5">
              {/* <CopyBlock
                text={String(children)}
                language={match[1]}
                showLineNumbers={false}
                wrapLongLines
                theme={dracula}
                {...props}
              /> */}
              {/* <pre
                style={{ width: "100%" }}
                className={`language-${language} chat-code-response ${
                  openExportModel ? "openExportModal" : ""
                }`}
                {...props}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightedCode(codeString, language),
                  }}
                />
              </pre> */}
               <div className="text-[#b4b4b4] flex items-center justify-between text-[14px] p-[5px] w-[830px] bg-[#2f2f2f] rounded-tr-[.5em] rounded-tl-[.5em] px-4 language-header">
               {language}
              <Tooltip
                placement="bottom"
                content={
                  <div
                    className="cursor-pointer text-sm text-[#FFF] font-helvetica font-normal"
                    onClick={() => handleCopy(codeString)}
                  >
                    {copySuccess}
                  </div>
                }
                classNames={{
                  content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
                }}
                delay={0}
                closeDelay={0}
              >
                {!openExportModel && (
                  <Button
                    onClick={() => handleCopy(codeString)}
                    className="h-[28px]  flex items-center gap-1 cursor-pointer !p-0 bg-[#242222] min-w-[30px]"
                  >
                    {copySuccess === "Copy code" ? (
                      <CopyIcon className="text-gray-400 text-sm" />
                    ) : (
                      <CheckIcon className="w-4 h-4 text-gray-400  text-sm" />
                    )}
                  </Button>
                )}
              </Tooltip>
              </div>
              <pre
                className={`!mt-0 !rounded-tr-[0px] !rounded-tl-[0px] language-${language} chat-code-response ${
                  openExportModel ? "openExportModal" : ""
                }`}
                {...props}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightedCode(codeString, language),
                  }}
                />
              </pre>
            </div>
          );
        }

        if (inline) {
          return (
            <code
              style={{
                backgroundColor: "#1e1e1e", // Dark background
                color: "#c9d1d9", // Light text
                padding: "2px 5px",
                borderRadius: "4px",
                fontSize: "90%",
                fontFamily: "monospace",
              }}
              {...props}
            >
              {highlightText(children)}
            </code>
          );
        }

        return (
          // <pre className={`language-${language} chat-code-response`} {...props}>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                String(children).trim(),
                Prism.languages[language] || Prism.languages.javascript,
                language
              ),
            }}
          />
          // </pre>
        );
      },

      table({ children, ...props }) {
        const [copySuccess, setCopySuccess] = useState("Copy Table");

        const handleCopy = (tableElement) => {
          try {
            // Extract table rows
            const rows = Array.from(tableElement.querySelectorAll("tr"));
            const tableData = rows
              .map((row) => {
                const cols = Array.from(row.querySelectorAll("th, td"));
                return cols.map((col) => col.innerText.trim()).join("\t"); // Join columns with tab space
              })
              .join("\n"); // Join rows with new line

            // Copy table data to clipboard
            navigator.clipboard.writeText(tableData);
            setCopySuccess("Copied!");
            setTimeout(() => setCopySuccess("Copy Table"), 2000);
          } catch (error) {
            console.error("Failed to copy table:", error);
          }
        };

        return (
          <div className="relative">
            <Button
              onClick={(e) => handleCopy(e.currentTarget.nextSibling)}
              className=" h-[30px] absolute top-[-38px] right-[-10px] flex items-center gap-1 cursor-pointer mr-4 mt-2 bg-[#242222] min-w-8 opacity-[0.5]"
              style={{ borderRadius: "10px 10px 0 0", padding: "0 11px" }}
            >
              📋 {copySuccess}
            </Button>

            {/* Table */}
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                margin: "40px 0",
                backgroundColor: "gray",
                color: "white",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #111",
                borderSpacing: "0",
              }}
              {...props}
            >
              {highlightText(children)}
            </table>
          </div>
        );
      },
      strong({ children }) {
        return (
          <strong style={{ fontWeight: "bold" }}>
            {" "}
            {highlightText(children)}
          </strong>
        );
      },

      em({ children }) {
        return (
          <em style={{ fontStyle: "italic" }}> {highlightText(children)}</em>
        );
      },
      u({ children }) {
        return (
          <span style={{ textDecoration: "underline" }}>
            {highlightText(children)}
          </span>
        );
      },
      p({ node, children, ...props }) {
        // Function to check if any child contains a <u> tag
        const containsUnderline = (child) => {
          if (!child) return false;

          if (typeof child === "object") {
            // Check if this child is an <u> tag (direct check)
            if (child.type === "u") return true;

            // Check if it's an array of elements and recursively search
            if (Array.isArray(child)) return child.some(containsUnderline);

            // Check if it's a React element and contains underlined children
            if (child.props?.children)
              return containsUnderline(child.props.children);
          }

          return false;
        };

        const isUnderlined = containsUnderline(children);
        console.log("🚀 ~ isUnderlined:", isUnderlined);

        // Handle summary section logic
        if (isSummarySection) {
          isSummarySection = false;
          return (
            <p
              className={`text-[17px] ${
                openExportModel ? "text-[black]" : "text-white"
              } font-helvetica font-bold break-words leading-7.5`}
              style={isUnderlined ? { textDecoration: "underline" } : {}}
              {...props}
            >
              {children}
            </p>
          );
        }

        return (
          <div
            className={`text-[17px] ${
              openExportModel ? "text-[black]" : "text-white"
            } font-helvetica font-normal break-words leading-7.5`}
            style={isUnderlined ? { textDecoration: "underline" } : {}}
            {...props}
          >
            {children}
          </div>
        );
      },

      tr({ children, ...props }) {
        return (
          <tr
            style={{
              backgroundColor: "#303030", // Darker row color
              color: "white",
              borderBottom: "1px solid #444", // Border between rows
            }}
            {...props}
          >
            {/* {children} */}
            {highlightText(children)}
          </tr>
        );
      },
      hr({ children, ...props }) {
        return <hr className="my-10" style={{ border: "1px solid #343434" }} />;
      },
      h1({ children, ...props }) {
        return (
          <h1
            className={`text-[29px] ${
              openExportModel ? "text-[black]" : "text-white"
            }] font-helvetica my-5 font-bold table-cusr`}
            {...props}
          >
            {highlightText(children)}
          </h1>
        );
      },
      h2({ children, ...props }) {
        return (
          <h2
            className={`text-[26px] ${
              openExportModel ? "text-[black]" : "text-white"
            }] font-helvetica my-5 font-bold table-cusr`}
            {...props}
          >
            {highlightText(children)}
          </h2>
        );
      },
      h3({ children, ...props }) {
        const childArray = React.Children.toArray(children);
        const firstChild = childArray[0];

        // Check if the heading is "Summary:"
        if (
          typeof firstChild === "string" &&
          firstChild.trim().toLowerCase() === "summary:"
        ) {
          isSummarySection = true; // Set flag to bold the next paragraph
        }
        return (
          <h3
            className={`text-[23px] ${
              openExportModel ? "text-[black]" : "text-white"
            } font-helvetica my-5 font-bold table-cusr`}
            {...props}
          >
            {highlightText(children)}
          </h3>
        );
      },
      h4({ children, ...props }) {
        return (
          <h3
            className={`text-[19px]  ${
              openExportModel ? "text-[black]" : "text-white"
            }]  font-helvetica my-4 font-bold table-cusr`}
            {...props}
          >
            {highlightText(children)}
          </h3>
        );
      },
      td({ children, ...props }) {
        return (
          <td
            style={{
              padding: "12px 15px",
              border: "1px solid #444",
              backgroundColor: "black", // Darker background for table cells
              textAlign: "left",
            }}
            {...props}
          >
            {highlightText(children)}
          </td>
        );
      },
      th({ children, ...props }) {
        return (
          <th
            style={{
              padding: "8px",
              border: "1px solid #444",
              fontWeight: "bold",
              textAlign: "left",
            }}
            {...props}
          >
            {highlightText(children)}
          </th>
        );
      },
      a({ href, children, ...props }) {
        return (
          <a
           className="hover:!text-[#5e83b3]"
            style={{ color: "#7ab7ff", textDecoration: "underline" }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {/* {highlightText(children)} */}
            {extractDomain(highlightText(children))}
          </a>
        );
      },

      ol({ children, ...props }) {
        return (
          <ol
            style={{ listStyleType: "number", paddingLeft: "21px" }}
            className={`text-[17px] ${
              openExportModel ? "text-[black]" : "text-white"
            }] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]`}
            {...props}
          >
            {highlightText(children)}
          </ol>
        );
      },
      ul({ children, ...props }) {
        return (
          <ul
            style={{ listStyleType: "disc", paddingLeft: "21px" }}
            className={`text-[17px] ${
              openExportModel ? "text-[black]" : "text-white"
            }]  font-helvetica font-normal tracking-[0.2px] leading-[28.8px]`}
            {...props}
          >
            {highlightText(children)}
          </ul>
        );
      },
    };
  }, []);

  const renderedMarkdown = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective]}
        rehypePlugins={[rehypeMathjax, rehypeRaw]}
        className="user-prompt"
        components={customComponents}
      >
        {cleanedData}
      </ReactMarkdown>
    );
  }, [cleanedData, customComponents]);

  return (
    <>
      {/* <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax, rehypeRaw]}
        className="user-prompt"
        components={customComponents}
      >
        {cleanedData}
      </ReactMarkdown> */}
      <div
        onMouseUp={handleTextSelection} // Handle text selection
        onMouseDown={(e) => e.stopPropagation()}
      >
        {renderedMarkdown}
      </div>
      {imageUrls.length > 0 && (
        <div className="image-container flex gap-5">
          {imageUrls.map((url, index) => (
            <>
              <div
                className="relative"
                onMouseEnter={() => setHoveredImg(index)}
                onMouseLeave={() => setHoveredImg(null)}
              >
                <Image
                  key={index}
                  src={url}
                  alt={`Extracted Image ${index + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    margin: "10px 0",
                    width: "200px",
                  }}
                  width={200}
                  height={200}
                  onClick={() => handleImageClick(url)}
                />
                {HoveredImg === index && (
                  <div className="absolute top-2 right-2 z-10">
                    <ImageDownload imgUrl={url} />
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      )}

      {audioUrls.length > 0 && (
        <div className="image-container flex gap-5 flex-wrap">
          {audioUrls.map((url, index) => (
            <div key={index}>
              <div className="relative">
                <audio controls>
                  <source src={url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && selectedImage && (
        <ViewImagePopup
          isOpen={isOpen}
          image={selectedImage}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};
export default ReactMarkDown;

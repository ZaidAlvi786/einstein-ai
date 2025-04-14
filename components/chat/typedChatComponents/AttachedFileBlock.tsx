import { Image } from "@nextui-org/react";
import { audioTypeSupport } from "../chatConstants";

export const AttachedFileBlock = ({
  attachedFiles,
}: {
  attachedFiles: any;
}) => {
  return (
    <div className="flex gap-4">
      {attachedFiles?.map((file: string, index: number) => {
        const fileType = file?.split(".").pop();
        const fileIcon =
        fileType === "doc"
            ? "/fileIcons/docIcon.png"
            : fileType === "docx"
            ? "/fileIcons/docxIcon.png"
            : fileType === "pdf"
            ? "/fileIcons/pdfIcon.png"
            : fileType === "txt"
            ? "/fileIcons/txtIcon.png"
            : fileType === "csv"
            ? "/fileIcons/csvIcon.png"
            : fileType === "xlsx"
            ? "/fileIcons/xlsxIcon.png"
            : "/fileIcons/unknownFileIcon.png";
        return (
          <div key={index}>
            {file?.split(".").pop() === "png" ? (
              <Image
                src={file}
                alt="attach-chat"
                width={"200px"}
                height={"200px"}
                style={{
                  maxWidth: "200px",
                  // maxHeight: "200px",
                  objectFit: "cover",
                  // marginLeft: "15px",
                  minHeight: "100%",
                  zIndex: 0,
                }}
              />
            ) : audioTypeSupport.includes(file?.split(".").pop() || "") ? (
              <div className="relative">
                <audio controls>
                  <source
                    src={file}
                    type="audio/mpeg"
                    
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )  :  (
              <div className="relative">
                 <Image
                          src={fileIcon}
                          alt="profile-pic"
                          width={60}
                          height={60}
                          fallbackSrc='/fileIcons/unknownFileIcon.png'
                        />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

import { Image } from "@nextui-org/react";

export const AttachedImageBlock = ({
  attachedFiles,
}: {
  attachedFiles: any;
}) => {
  return (
    <>
      {attachedFiles?.map((file: string, index: number) => {
        return (
          <Image
            src={file}
            alt="attach-chat"
            width={"auto"}
            height={"auto"}
            style={{
              maxWidth: "530px",
              maxHeight: "225px",
              objectFit: "cover",
            }}
          />
        );
      })}
    </>
  );
};

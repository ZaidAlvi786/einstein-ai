import { Progress, Checkbox } from '@mantine/core';
import { PdfFileIcon } from '@assets/iconComponents';

interface Props {
  file: File;
}

export const FileDropzone = ({ file }: Props) => {
  const fileSizeInKb = (file?.size ?? 0 / 1024).toFixed(2);
  return (
    <div className="flex gap-3 p-4 border-gray-200 border-solid border">
      <PdfFileIcon className="size-10" />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <span className="text-sm-medium">{file?.name}</span>
          <Checkbox />
        </div>
        <div className="text-sm-regular text-gray-600">{fileSizeInKb} KB</div>
        <div className="flex items-center gap-3">
          <Progress value={50} className="flex-1" />
          <span>50%</span>
        </div>
      </div>
    </div>
  );
};
/* {rejectedFiles.map((reject) => {
          const { file } = reject;
          const fileSizeInKb = (file?.size / 1024).toFixed(2);
          return (
            <div className="flex gap-3 p-4 border-gray-200 border-solid border">
              <PdfFileIcon className="size-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between">
                  <span className="text-sm-medium">{file?.name}</span>
                  <Checkbox />
                </div>
                <div className="text-sm-regular text-gray-600">{fileSizeInKb} KB</div>
                <div className="flex items-center gap-3">
                  <Progress value={50} className="flex-1" />
                  <span>50%</span>
                </div>
              </div>
            </div>
          );
        })} */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FileImage, FileText, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useUploadImageMutation } from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  fileInputRefNew: any;
  setAttachedFiles: any;
  setIsLoading: any;
  preview: any;
  setPreview: any;
}

export function FileDropZone({
  onFilesSelected,
  accept = "image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  fileInputRefNew,
  setAttachedFiles,
  setIsLoading,
  preview,
  setPreview,
}: FileDropZoneProps) {
  console.log("🚀 ~ preview:", preview)
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [UploadImage] = useUploadImageMutation();

  // const handleFiles = useCallback(
  //   (newFiles: File[]) => {
  //     // const validFiles = newFiles.filter(
  //     //   (file) =>
  //     //     (file.type.startsWith("image/") ||
  //     //       file.type.startsWith("video/") ||
  //     //       file.type === "application/pdf" ||
  //     //       file.type.includes("officedocument")) &&
  //     //     files.length + newFiles.length <= maxFiles
  //     // );
  //     const validFiles = newFiles.filter((file) =>
  //       file.type.startsWith("image/")
  //     );

  //     const InValidFiles = newFiles.filter(
  //       (file) => !file.type.startsWith("image/")
  //     );
  //     // Show alert if there are any invalid files in case of drag and drop along with image files
  //     if (InValidFiles.length > 0) {
  //       toast.error("You can only upload images");
  //     }

  //     if (validFiles.length > 0) {
  //       // only for preview
  //       const newPreviews = validFiles.map((file) => ({
  //         url:
  //           file.type.startsWith("image/") || file.type.startsWith("video/")
  //             ? URL.createObjectURL(file) // Generate URL for preview
  //             : null,
  //         type: file.type,
  //         name: file.name,
  //       }));
  //       setFiles((prev) => [...prev, ...validFiles]);
  //       onFilesSelected([...files, ...validFiles]);
  //       // upload to get S3 url
  //       // validFiles.forEach((file) => {
  //       uploadFileToS3(validFiles, newPreviews);
  //       // });
  //     } else {
  //       toast.error("You can only upload images");
  //       setIsLoading(false);
  //     }
  //   },
  //   [files, onFilesSelected]
  // );

  // const uploadFileToS3 = async (file: Array<File>, previewFiles: any) => {
  //   try {
  //     const formData = new FormData();
  //     file.forEach((file) => {
  //       formData.append("image", file);
  //     });

  //     UploadImage(formData)
  //       .unwrap()
  //       .then((response) => {
  //         console.log("🚀 ~ .then ~ response:", response)
  //         const url = response?.url;
  //         setAttachedFiles((prev: any) => [...prev, url]);
  //         setPreview((prev: any) => [...prev, ...previewFiles]);
  //       })
  //       .catch((error) => {
  //         // console.error(`Failed to upload file ${file.name}:`, error);
  //         toast.error("Failed to upload file");
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   } catch (error) {
  //     // console.error(`Failed to upload file ${file.name}:`, error);
  //     toast.error("Failed to upload file");
  //   }
  // };

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      if(newFiles?.length > 2 || preview?.length + newFiles.length > 2) {
        toast.error("Please select upto 2 files")
        setIsLoading(false)
        return 
      }
      // Define size limit in bytes (900 KB = 900 * 1024)
      const sizeLimit = 900 * 1024;
  
      // Filter valid files based on type and size
      const validFiles = newFiles.filter(
        (file) => file.type.startsWith("image/") && file.size <= sizeLimit
      );
  
      // Filter invalid files
      const InValidFiles = newFiles.filter(
        (file) =>
          !file.type.startsWith("image/") || file.size > sizeLimit
      );
  
      // Show alert if there are any invalid files
      if (InValidFiles.length > 0) {
        toast.error(
          "You can only upload image files smaller than 900 KB."
        );
      }
  
      if (validFiles.length > 0) {
        // Only for preview
        const newPreviews = validFiles.map((file) => ({
          url: URL.createObjectURL(file), // Generate URL for preview
          type: file.type,
          name: file.name,
        }));
        setFiles((prev) => [...prev, ...validFiles]);
        onFilesSelected([...files, ...validFiles]);
        setPreview((prev: any) => [...prev, ...newPreviews]);
  
        // Upload valid files to get S3 URLs
        validFiles.forEach((file) => {
          uploadFileToS3(file, newPreviews);
        });
      } else {
        toast.error("You can only upload image files smaller than 900 KB.");
        setIsLoading(false);
      }
    },
    [files, onFilesSelected]
  );
  

  const uploadFileToS3 = async (file: File, previewFiles: any) => {
    try {
      const formData = new FormData();
      // file.forEach((file) => {
      //   formData.append("image", file);
      // });
      formData.append("image", file);

      UploadImage(formData)
        .unwrap()
        .then((response) => {
          console.log("🚀 ~ .then ~ response:", response);
          const url = response?.url;
          setAttachedFiles((prev: any) => [...prev, url]);
          // setPreview((prev: any) => [...prev, ...previewFiles]);
        })
        .catch((error) => {
          // console.error(`Failed to upload file ${file.name}:`, error);
          toast.error("Failed to upload file");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      // console.error(`Failed to upload file ${file.name}:`, error);
      toast.error("Failed to upload file");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);
      setIsLoading(true);
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const useEffecthandleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);
      if (e.dataTransfer) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => Math.max(prev - 1, 0));
      if (dragCounter <= 1) {
        setIsDragging(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const useEffecthandleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      URL.revokeObjectURL(preview[index]);
      setPreview((prev: any) => prev.filter((_: any, i: any) => i !== index));
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setAttachedFiles((prev: any) =>
        prev.filter((_: any, i: any) => i !== index)
      );
    },
    [preview]
  );

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", useEffecthandleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", useEffecthandleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", useEffecthandleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", useEffecthandleDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  // const handleImageClick = () => {
  //   if (fileInputRefNew.current) {
  //     fileInputRefNew.current.click(); // Simulate click on file input
  //   }
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setIsLoading(true);
      handleFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div className={cn("w-full")}>
      {isDragging && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => setIsDragging(false)}
        >
          <div className="relative text-white rounded-lg p-8 text-center cursor-pointer transition-colors w-3/4 max-w-2xl bg-transparent">
            <div
              className="flex items-center justify-end p-1"
              style={{
                border: "1px solid white",
                borderRadius: "50px",
                width: "80px",
                margin: "20px auto",
              }}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center"></div>
            </div>
            <p className="text-3xl font-bold">Add to Chat</p>
            <p className="text-md mt-3">Drop image files here</p>
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-4 p-2">
          {preview.map(({ url, type, name }: any, index: any) => (
            <div key={name} className="relative group">
              {type.startsWith("image/") ? (
                <img
                  src={url}
                  alt={`Preview ${name}`}
                  className="w-32 h-16 object-cover rounded-lg"
                />
              ) : type.startsWith("video/") ? (
                <video
                  src={url}
                  className="w-32 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                  {type === "application/pdf" ? (
                    <FileText className="w-6 h-6 text-gray-500" />
                  ) : (
                    <FileImage className="w-6 h-6 text-gray-500" />
                  )}
                  <p className="text-sm truncate">{name}</p>
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-[-6px] right-[-4px] bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRefNew}
        style={{ display: "none" }}
        onChange={handleInputChange}
        accept={accept}
      />
    </div>
  );
}

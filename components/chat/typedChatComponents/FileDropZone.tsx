"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FileImage, FileText, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  useUploadFileMutation,
  useUploadImageMutation,
} from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import {  Image } from "@nextui-org/react";
import { useAppSelector } from "@/app/lib/hooks";
import {
  audioTypeSupport,
  fileTypeSupport,
  imageTypeSupport,
} from "../chatConstants";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  fileInputRefNew: any;
  setAttachedFiles: any;
  setIsLoading: any;
  attachedFiles: any;
}

export function FileDropZone({
  onFilesSelected,
  accept,
  fileInputRefNew,
  attachedFiles,
  setAttachedFiles,
  setIsLoading,
}: FileDropZoneProps) {
  console.log("attachedFiles: ", attachedFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [UploadImage] = useUploadImageMutation();
  const [UploadFile] = useUploadFileMutation();
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );

  const handleImageFiles = useCallback(
    (newFiles: File[]) => {
      if (newFiles?.length > 2 || attachedFiles?.length + newFiles.length > 2) {
        toast.error("Please select upto 2 files");
        setIsLoading(false);
        return;
      }

      // Define size limit in bytes (900 KB = 900 * 1024)
      const sizeLimit = 900 * 1024;

      // Filter valid files based on type and size (only for image files)
      const validFiles = newFiles.filter((file) => {
        const fileType = file.type.split("/")[1]; // Get the file extension (e.g., "png", "jpeg")

        if (file.type.startsWith("image/")) {
          if (!imageTypeSupport.includes(fileType) && file.size <= sizeLimit) {
            toast.error(
              `You can upload only ${imageTypeSupport.join(", ")} type file`
            );
            return;
          }
          // return imageTypeSupprt.includes(fileType) && file.size <= sizeLimit;
        }
        return file.size <= sizeLimit;
      });

      // Filter invalid files
      const InValidFiles = newFiles.filter(
        (file) => !file.type.startsWith("image/") || file.size > sizeLimit
      );

      // Show alert if there are any invalid files
      if (InValidFiles.length > 0) {
        toast.error("You can only upload image files smaller than 900 KB.");
      }

      if (validFiles.length > 0) {
        validFiles.forEach((file) => {
          uploadFileToS3(file);
        });
      } else {
        setIsLoading(false);
      }
    },
    [files, onFilesSelected]
  );

  const uploadFileToS3 = async (file: File) => {
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

  // handle text files

  const handleTextFiles = useCallback(
    (newFiles: File[]) => {
      setIsLoading(true);

      // Check if the total files exceed the limit
      // const attachedFilesCount = attachedFiles?.length || 0;
      // if (newFiles?.length > 2 || attachedFilesCount + newFiles.length > 2) {
      //   toast.error("Please select up to 2 files");
      //   setIsLoading(false);
      //   return;
      // }
      // Corrected extensions
      const sizeLimit = 1 * 1024 * 1024; // 1 mb
      const validFiles = newFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase(); // Get the file extension
        const isValidType =
          fileExtension && fileTypeSupport.includes(fileExtension);
        const isValidSize = file.size <= sizeLimit;

        if (!isValidType) {
          toast.error(
            `You can upload only ${fileTypeSupport.join(", ")} files.`
          );
          return false;
        }

        if (!isValidSize) {
          toast.error(`File size should be smaller than 1MB.`);
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        // Process the valid files
        validFiles.forEach((file) => {
          uploadTextFileToS3(file);
        });
      } else {
        setIsLoading(false);
      }
    },
    [files, onFilesSelected] // Ensure `attachedFiles` is in dependency array
  );
  const uploadTextFileToS3 = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      UploadFile(formData)
        .unwrap()
        .then((response) => {
          console.log("🚀 ~ .then ~ response:", response);
          const url = response?.urls;
          if (url) {
            setAttachedFiles((prev: any) => [...prev, ...url]);
          } else if (response?.error) {
            toast.error(response?.error);
          }
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

  // hanlde audio file

  const handleAudioFiles = useCallback(
    (newFiles: File[]) => {
      if (newFiles?.length > 2 || attachedFiles?.length + newFiles.length > 2) {
        toast.error("Please select upto 2 files");
        setIsLoading(false);
        return;
      }

      // Define size limit in bytes (900 KB = 900 * 1024)
      const sizeLimit = 900 * 1024;

      // Filter valid files based on type and size (only for image files)
      const validFiles = newFiles.filter((file) => {
        const fileType = file.type.split("/")[1]; // Get the file extension (e.g., "png", "jpeg")
        console.log(
          "🚀 ~ validFiles ~ audioTypeSupport: ===>",
          audioTypeSupport
        );
        console.log("🚀 ~ validFiles ~ fileType: ===>", fileType);

        if (file.type.startsWith("audio/")) {
          if (!audioTypeSupport.includes(fileType) && file.size <= sizeLimit) {
            toast.error(
              `You can upload only ${audioTypeSupport.join(", ")} type file`
            );
            return;
          }
          // return imageTypeSupprt.includes(fileType) && file.size <= sizeLimit;
        }
        return file.size <= sizeLimit;
      });

      // Filter invalid files
      const InValidFiles = newFiles.filter(
        (file) => !file.type.startsWith("audio/") || file.size > sizeLimit
      );

      // Show alert if there are any invalid files
      if (InValidFiles.length > 0) {
        toast.error("You can only upload audio files smaller than 900 KB.");
      }

      if (validFiles.length > 0) {
        validFiles.forEach((file) => {
          uploadAudioToS3(file); // same as file upload
        });
      } else {
        setIsLoading(false);
      }
    },
    [files, onFilesSelected]
  );

  const uploadAudioToS3 = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      UploadFile(formData)
        .unwrap()
        .then((response) => {
          console.log("🚀 ~ .then ~ response:", response);
          const url = response?.urls;
          if (url) {
            setAttachedFiles((prev: any) => [...prev, ...url]);
          } else if (response?.error) {
            toast.error(response?.error);
          }
        })
        .catch((error) => {
          toast.error("Failed to upload file");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      setDragCounter(0);
      if (e.dataTransfer?.types.includes("Files")) {
        setIsLoading(true);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 2 && activeChatModel?.image_upload_support) {
          toast.error("Please select upto 2 files");
          setIsLoading(false);
          return;
        }
        console.log("droppedFiles: ", droppedFiles);
        droppedFiles.forEach((file: any) => {
          if (
            (file.type.startsWith("application/") ||
              file.type.startsWith("text/")) &&
            activeChatModel?.document_upload_support
          ) {
            handleTextFiles([file]);
          } else if (
            activeChatModel?.image_upload_support &&
            file.type.startsWith("image/")
          ) {
            handleImageFiles([file]);
          } else if (
            activeChatModel?.audio_upload_support &&
            file.type.startsWith("audio/")
          ) {
            handleAudioFiles([file]);
          } else {
            if (activeChatModel?.image_upload_support) {
              toast.error("You can only upload image files");
              setIsLoading(false);
            }
            if (activeChatModel?.document_upload_support) {
              toast.error("You can only upload document files");
              setIsLoading(false);
            }
            if (activeChatModel?.audio_upload_support) {
              toast.error("You can only upload audio files");
              setIsLoading(false);
            }
          }
        });
      }
    },
    [handleImageFiles, handleTextFiles]
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if the dragged item is a file
    if (e.dataTransfer?.types.includes("Files")) {
      setDragCounter((prev) => prev + 1);
      setIsDragging(true);
    }
    // setDragCounter((prev) => prev + 1);
    // setIsDragging(true);
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

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setAttachedFiles((prev: any) =>
        prev.filter((_: any, i: any) => i !== index)
      );
    },
    [attachedFiles]
  );

  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        handleDragEnter(e);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        handleDrop(e as unknown as React.DragEvent);
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        handleDragLeave(e);
      }
    };

    window.addEventListener("dragenter", handleGlobalDragEnter);
    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("dragleave", handleGlobalDragLeave);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      window.removeEventListener("dragenter", handleGlobalDragEnter);
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("dragleave", handleGlobalDragLeave);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, [handleDragEnter, handleDrop, handleDragLeave]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = event.target.files;
  //   if (selectedFiles && selectedFiles?.length > 0) {
  //     setIsLoading(true);
  //     if (
  //       selectedFiles[0].type.startsWith("application/") ||
  //       selectedFiles[0].type.startsWith("text/")
  //     ) {
  //       handleTextFiles(Array.from(selectedFiles));
  //     } else {
  //       handleImageFiles(Array.from(selectedFiles));
  //     }
  //   }
  // };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setIsLoading(true);
      const file = selectedFiles[0];
      if (
        file.type.startsWith("application/") ||
        file.type.startsWith("text/")
      ) {
        // Handle Text or Document files
        handleTextFiles(Array.from(selectedFiles));
      } else if (file.type.startsWith("image/")) {
        // Handle Image files
        handleImageFiles(Array.from(selectedFiles));
      } else if (file.type.startsWith("audio/")) {
        // Handle Audio files
        handleAudioFiles(Array.from(selectedFiles));
      } else {
        alert("Unsupported file format!");
      }
    }
  };

  return (
    <div className={cn("w-full contents")}>
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

      {attachedFiles.length > 0 && (
        // <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-4 p-2">
        <div className="flex gap-4 p-2">
          {attachedFiles?.map((url: any, index: any) => {
            const file = url?.split(".").pop();
            const fileIcon =
              file === "doc"
                ? "/fileIcons/docIcon.png"
                : file === "docx"
                ? "/fileIcons/docxIcon.png"
                : file === "pdf"
                ? "/fileIcons/pdfIcon.png"
                : file === "txt"
                ? "/fileIcons/txtIcon.png"
                : file === "csv"
                ? "/fileIcons/csvIcon.png"
                : file === "xlsx"
                ? "/fileIcons/xlsxIcon.png"
                : "/fileIcons/unknownFileIcon.png";

            return (
              <div key={url} className="relative group">
                {url?.split(".").pop() === "png" ? (
                  <Image
                    alt={`attachedFiles ${name}`}
                    className="w-16 h-16 object-cover rounded-lg"
                    src={url}
                  />
                ) : audioTypeSupport.includes(url?.split(".").pop()) ? (
                  <div className="relative">
                    <audio controls>
                      <source src={url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
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
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-[-6px] right-[-4px] bg-gray-300 rounded-full z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
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

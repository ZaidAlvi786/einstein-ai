import { Image } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UnitDetailsForm } from './schemas';
import { UploadCloud02Icon, XCloseIcon } from '@assets/iconComponents';
import clsx from 'clsx';
import ViewImageModal from '@components/ViewImageModal';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

interface Props {
  methods: UseFormReturn<UnitDetailsForm>;
  index: number;
  unitType: 'multiple' | 'single';
  error:any;
}
export const FileDropzone = ({ methods, index, unitType,error }: Props) => {
  const {
    control,
    watch,
    setValue,
    getFieldState,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;
  const baseUrl  = import.meta.env.VITE_API_URL
  const images: any = watch(`${unitType}.${index}.images`, []);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<FileWithPath[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState('');
  const [viewImage, setviewImage] = useState(false);
  const [imageurl, setImageurl] = useState('');
  const [uploadButton, setUploadButton] = useState(false);

  useEffect(() => {
    if (images?.length > 0) {
      // Create object URLs for the selected files
      const previews = images?.map((file: FileWithPath) =>  {
        if (file instanceof File) { 
          return  URL.createObjectURL(file)
        } else {
          return baseUrl + file;
        }
        
      })
      setImagePreviews(previews);
      if (images?.length < 10) {
        setUploadButton(false);
      }else{
        setUploadButton(true)
      }
      // Cleanup function to revoke object URLs
      return () => {
        previews?.forEach((url: string) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);
  const handleDrop = useCallback(
    async (files: any) => {
      const totalFiles = await [...((images || []) as FileWithPath[])]?.length;
      if (files.length > 10) {
        setError(`${unitType}.${index}.images`, {
          type: 'manual',
          message: 'You can upload up to 10 files only',
        });
        setValue(`${unitType}.${index}.images`, []);
        return;
      }
      clearErrors(`${unitType}.${index}.images`);
      setIsLoading(true);
      const promises = files.map((file: any) => {
        const img = document.createElement('img');
        img.src = window.URL.createObjectURL(file);
        img.onload = () => {
          window.URL.revokeObjectURL(img.src);
        };

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      });

      await Promise.all(promises)
      .then((base64Array) => {
        
        const photoFiles = files.map((file: File) => new File([file], file.name ?? '', { type: file.type }));
        setValue(`${unitType}.${index}.images`, [...images ,...photoFiles].slice(0,10));
        if ([...images, ...photoFiles]?.length >= 10) {
          setUploadButton(true);
        } else {
          setUploadButton(false);
        }
        // setValue('photos', photoFiles);
        setIsLoading(false);
      })
      .catch((error) => {
     setIsLoading(false);
      });

      // await Promise.all(promises)
      //   .then((base64Array) => {
      //     setValue(`${unitType}.${index}.images`, [
      //       ...(images as FileWithPath[]),
      //       ...(base64Array as FileWithPath[]),
      //     ]);
      //     setIsLoading(false);
      //   })
      //   .catch(() => {
      //     setIsLoading(false);
      //   });
    },
    [images, unitType, index, setValue]
  );

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const rearrange = arrayMoveImmutable(images, oldIndex, newIndex);
    setValue(`${unitType}.${index}.images`, rearrange);
  };
 
  const handleRemove = useCallback(
    async (index: number) => {
      if(images?.length as any >0){
      if (index === 0) {
        setImagePreviews([]);
      }
        const updatedImages = [...(images as any)];
        updatedImages.splice(index, 1);
        setValue(`${unitType}.${index}.images`, updatedImages);
    }
    },
    [images]
  );
  return (
    <div className={`grid grid-cols-${uploadButton ? 3 : 4} gap-4`}>
    <div className="col-span-4">
      <SortableList
        onSortEnd={onSortEnd}
        className={`w-full grid ${images?.length >= 4 ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-10'} items-center   `}
        draggedItemClassName="dragged"
        style={{ userSelect: 'none' }}
      >
        {!uploadButton && (
          <div className="">
            <Dropzone
              multiple={true}
              accept={IMAGE_MIME_TYPE}
              loading={isLoading}
              onDrop={handleDrop}
              onReject={() => {}}
              maxSize={5 * 1024 ** 2}
              className=" uploadBtn rounded-md !border-solid border flex items-center justify-center w-20 me-2.5"
            >
              <div className="flex items-center justify-center order-1">
                <UploadCloud02Icon />
              </div>
            </Dropzone>
          </div>
        )}
        {imagePreviews?.map((file: string, index: number) => {
          if (!file) return null;
          return (
            <SortableItem key={file}>
              <div
                className=" cursor-grabbing relative   "
                style={{ userSelect: 'none',zIndex:"9999999" }}
                onMouseEnter={() => setIsHovered(file)}
                onMouseLeave={() => setIsHovered('')}
                onClick={() => {
                  setImageurl(file);
                  setviewImage(true);
                }}
              >
                <Image
                  key={index + 1}
                  src={file}
                  className={clsx(
                    'rounded uploadedImage',
                    index === 0 && 'border-2 border-solid border-success-600 '
                  )}
                  style={{ pointerEvents: 'none', draggable: false ,}}
                />
                {isHovered && file === isHovered && (
                  <XCloseIcon
                    className="absolute left-14 top-0  w-5 h-5 cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemove(index);
                    }}
                  />
                )}
              </div>
            </SortableItem>
          );
        })}
      </SortableList>
      {
     error&& 
        <div className=" w-full grid text-xs text-error-600 me-3.5 mt-2">{error}</div>
      }
    </div>
    { viewImage && (
      <ViewImageModal viewImage={viewImage} setviewImage={setviewImage} imageurl={imageurl} />
    )}
  </div>
  );
};






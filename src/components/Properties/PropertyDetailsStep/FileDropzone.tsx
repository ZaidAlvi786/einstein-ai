import { Image } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDetailsForm } from './schemas';
import { UploadCloud02Icon } from '@assets/iconComponents';
import clsx from 'clsx';
import { XCloseIcon } from '@assets/iconComponents';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import ViewImageModal from '@components/ViewImageModal';
import { number } from 'prop-types';

interface Props {
  methods: UseFormReturn<PropertyDetailsForm> ;
}

export const FileDropzone = ({ methods }: Props) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadButton, setUploadButton] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<FileWithPath[]>([]);
  const images = watch('photos', []);
  const baseUrl = import.meta.env.VITE_API_URL;
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState('');
  const [viewImage, setviewImage] = useState(false);
  const [imageurl, setImageurl] = useState('');

  const handleDrop = useCallback(
    async (files: any) => {
      if (files.length > 10) {
        setError(`photos`, {
          type: 'manual',
          message: 'You can upload up to 10 files only',
        });
        setValue(`photos`, []);
        return;
      }
      clearErrors(`photos`);
      setIsLoading(true);
      const promises = files?.map((file: any) => {
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
          const photoFiles = files?.map(
            (file: File) => new File([file], file?.name ?? '', { type: file?.type })
          );
          setValue(`photos`, [...images as any, ...photoFiles].slice(0, 10));
          if ([...images as any, ...photoFiles]?.length >= 10) {
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
    },
    [images, setValue]
  );

  useEffect(() => {
    if (images?.length as any > 0) {
      const previews = images?.map((file) => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        } else {
          return baseUrl + file;
        }
      });
      setImagePreviews(previews  as any);
      if (images?.length as any < 10) {
        setUploadButton(false);
      }else{
        setUploadButton(true)
      }
    
      return () => {
        previews?.forEach((url: string) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const rearrange = arrayMoveImmutable(images as any, oldIndex, newIndex);
    setValue('photos', rearrange as any);
  };
  const handleRemove = useCallback(
    async (index: number) => {
      if(images?.length as any >0){
      if (index === 0) {
        setImagePreviews([]);
      }
        const updatedImages = [...(images as any)];
        updatedImages.splice(index, 1);
        setValue('photos', updatedImages);
    }
    },
    [images]
  );
  // const handleRemove = async(index: number) => {
  //   if(index===0){
  //     setImagePreviews([])
  //   }
  //   const updatedImages = await[...images as any];
  //   await updatedImages?.splice(index, 1);
  //   setValue('photos', updatedImages);
  
   
   
  // };
  return (
    <div className={`grid grid-cols-${uploadButton ? 3 : 4} gap-4`}>
      <div className="col-span-4">
        {/* <Previews watch={watch} methods={methods} /> */}
        <SortableList
          onSortEnd={onSortEnd}
          className={`w-full grid ${images?.length as any >= 4 ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-10'} items-center   `}
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
                classNames={{
                  inner: 'px-2.5',
                }}
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
                  className=" cursor-grabbing relative  "
                  style={{ userSelect: 'none' }}
                  onMouseEnter={() => setIsHovered(file)}
                  onMouseLeave={() => setIsHovered('')}
                  onClick={() => {
                    setImageurl(file);
                    setviewImage(true);
                  }}
                >
                  <Image
                    key={index }
                    src={file}
                    className={clsx(
                      'rounded uploadedImage',
                      index === 0 && 'border-2 border-solid border-success-600 '
                    )}
                    style={{ pointerEvents: 'none', draggable: false }}
                  />
                  {isHovered && file === isHovered && (
                    <XCloseIcon
                      className="absolute left-14 top-0  w-5 h-5 cursor-pointer danger-600"
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
        {/* {errors.photos && (
          <div className=" w-full grid text-xs text-error-600 me-3.5">{errors.photos.message}</div>
        )} */}
      </div>
      { viewImage && (
        <ViewImageModal viewImage={viewImage} setviewImage={setviewImage} imageurl={imageurl} />
      )}
    </div>
  );
};


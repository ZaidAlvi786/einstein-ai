import { Image } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UploadCloud02Icon, XCloseIcon } from '@assets/iconComponents';
import clsx from 'clsx';
import ViewImageModal from '@components/ViewImageModal';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
// import { MultiUnitForm, UnitForm } from './schema';

interface Props {
  methods: any;
  index: number;
  unitType: 'multiple' | 'single';
  error: any;
}
export const FileDropzone = ({ methods, index, unitType, error }: Props) => {
  const { watch, setValue, setError, clearErrors } = methods;
  const baseUrl = import.meta.env.VITE_API_URL;
  const photos: any = watch('photos', []);
  const [isLoading, setIsLoading] = useState(false);
  // const [rejectedFiles, setRejectedFiles] = useState<FileWithPath[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState('');
  const [viewImage, setviewImage] = useState(false);
  const [imageurl, setImageurl] = useState('');
  const [uploadButton, setUploadButton] = useState(false);

  useEffect(() => {
    if (photos?.length > 0) {
      // Create object URLs for the selected files
      const previews = photos?.map((file: FileWithPath) => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        }
        return baseUrl + file;
      });
      setImagePreviews(previews);
      if (photos?.length < 10) {
        setUploadButton(false);
      } else {
        setUploadButton(true);
      }
      // Cleanup function to revoke object URLs
      return () => {
        previews?.forEach((url: string) => URL.revokeObjectURL(url));
      };
    }
  }, [photos]);

  const handleDrop = useCallback(
    async (files: any) => {
      const totalFiles = await [...((photos || []) as FileWithPath[])]?.length;
      if (files.length > 10) {
        setError('photos', {
          type: 'manual',
          message: 'You can upload up to 10 files only',
        });
        setValue('photos', []);
        return;
      }
      clearErrors('photos');
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
          const photoFiles = files.map(
            (file: File) => new File([file], file.name ?? '', { type: file.type })
          );
          setValue('photos', [...photos, ...photoFiles].slice(0, 10));
          if ([...photos, ...photoFiles]?.length >= 10) {
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
      //     setValue(`photos`, [
      //       ...(photos as FileWithPath[]),
      //       ...(base64Array as FileWithPath[]),
      //     ]);
      //     setIsLoading(false);
      //   })
      //   .catch(() => {
      //     setIsLoading(false);
      //   });
    },
    [photos, unitType, index, setValue]
  );

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const rearrange: any = arrayMoveImmutable(photos, oldIndex, newIndex);
    setValue('photos', rearrange);
  };

  const handleRemove = useCallback(
    async (index: number) => {
      if ((photos?.length as any) > 0) {
        if (index === 0) {
          setImagePreviews([]);
        }
        const updatedImages = [...(photos as any)];
        updatedImages.splice(index, 1);
        setValue('photos', updatedImages);
      }
    },
    [photos]
  );
  return (
    <div className={`grid grid-cols-${uploadButton ? 3 : 4} gap-4`}>
      <div className="col-span-4">
        <SortableList
          onSortEnd={onSortEnd}
          className={`w-full grid ${photos?.length >= 4 ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-10'} items-center   `}
          draggedItemClassName="dragged"
          style={{ userSelect: 'none' }}
        >
          {!uploadButton && (
            <div className="">
              <Dropzone
                multiple
                accept={IMAGE_MIME_TYPE}
                loading={isLoading}
                onDrop={handleDrop}
                onReject={() => {}}
                maxSize={5 * 1024 ** 2}
                className=" uploadBtn rounded-[6px] !border-solid border-[1px] flex items-center justify-center w-20 me-2.5"
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
                  style={{ userSelect: 'none', zIndex: '9999999' }}
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
                      'rounded-[4px] uploadedImage',
                      index === 0 && 'border-[2px] border-solid border-success-600 '
                    )}
                    style={{ pointerEvents: 'none', draggable: false }}
                  />
                  {isHovered && file === isHovered && (
                    <XCloseIcon
                      className="absolute left-14 top-0  w-5 h-5 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(index);
                      }}
                    />
                  )}
                </div>
              </SortableItem>
            );
          })}
        </SortableList>
        {error && <div className=" w-full grid text-xs text-error-600 me-3.5 mt-2">{error}</div>}
      </div>
      {viewImage && (
        <ViewImageModal viewImage={viewImage} setviewImage={setviewImage} imageurl={imageurl} />
      )}
    </div>
  );
};

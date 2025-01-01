import clsx from 'clsx';
import { Avatar, Box, Menu } from '@mantine/core';
import { Message as IMessage } from '@shared/components/TenantOverviewPanel/MessagePanel';
import { DefaultFileIcon, PdfIcon } from '@assets/iconComponents';
import { format } from 'date-fns';
import { formatFileSize } from '@utils/formatFileSize';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { iconsByExtension } from '@constants/fileIconsByExtension.contant';

const currentUser = {
  id: 12,
  name: 'John Doe',
};

interface MessageProps {
  data: IMessage;
  isTyping?: boolean;
  onReactEmoji?: (emoji: string) => void;
}

export const Message: React.FC<MessageProps> = ({
  data: { content, files = [], owner, date, reactionEmoji },
  isTyping = false,
  onReactEmoji,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const isCurrentUser = currentUser.id === owner.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    if (!isCurrentUser) setShowEmojiPicker(true);
    setShowContextMenu(true);
  };

  const handleReaction = (emoji: { emoji: string }) => {
    if (onReactEmoji) onReactEmoji(emoji.emoji);
    setShowContextMenu(false);
  };

  const handleRemoveReaction = () => {
    if (onReactEmoji) onReactEmoji('');
  };

  const renderMessageContent = () => (
    <Box
      className={clsx('py-2.5 px-3.5 text-[16px] leading-[24px] rounded-[8px]', {
        'rounded-tr-[0px] bg-Brand-600 text-white': isCurrentUser,
        'rounded-tl-[0px] bg-Gray-50 border border-solid border-Gray-200 text-Gray-900':
          !isCurrentUser,
      })}
      onContextMenu={handleContextMenu}
    >
      {content}
    </Box>
  );

  const renderFileAttachments = () => (
    <Box
      className={clsx('py-2.5 px-3.5 text-[16px] leading-[24px] rounded-[8px]', {
        'rounded-tr-[0px] bg-Brand-600 text-white': isCurrentUser,
        'rounded-tl-[0px] bg-Gray-50 border border-solid border-Gray-200 text-Gray-900':
          !isCurrentUser,
      })}
      onContextMenu={handleContextMenu}
    >
      <Box className="flex flex-col gap-2">
        {files.map((file, index) => (
          <Box key={index} className="flex gap-2 items-center">
            {iconsByExtension[
              file.name.split('.').pop()?.toLowerCase() as keyof typeof iconsByExtension
            ] || <DefaultFileIcon />}
            <Box className="flex flex-col">
              <span>{file.name}</span>
              <span>{formatFileSize(file.size)}</span>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderImages = () => (
    <Box className="flex flex-col gap-2">
      {files
        .filter(
          (file) =>
            file.name.split('.').pop()?.toLowerCase() === 'png' ||
            file.name.split('.').pop()?.toLowerCase() === 'jpg'
        )
        .map((file) => (
          <img width={500} src={URL.createObjectURL(file)} />
        ))}
    </Box>
  );

  const renderContextMenu = () =>
    showContextMenu &&
    contextMenuPosition && (
      <Box
        ref={contextMenuRef}
        className="absolute flex flex-col gap-4 w-[300px]"
        style={{
          top: contextMenuPosition.top + window.scrollY,
          left: contextMenuPosition.left + window.scrollX - (isCurrentUser ? 30 : 0),
        }}
      >
        {showEmojiPicker && (
          <EmojiPicker reactionsDefaultOpen={true} onReactionClick={handleReaction} />
        )}
        {/* <Box className="flex justify-center">
          <Box className="flex flex-col w-[80%]">
            <Menu
              classNames={{
                item: 'bg-blue-50 p-4 text-[20px] rounded-none hover:bg-blue-200',
              }}
            >
              {contextMenuItems}
            </Menu>
          </Box>
        </Box> */}
      </Box>
    );

  return (
    <Box className={clsx('flex', { 'justify-end': isCurrentUser })}>
      <Box className="flex gap-3 max-w-[80%]">
        {!isCurrentUser && (
          <Box className="relative">
            <Avatar
              src={owner.avatar}
              className="border-[0.75px] border-solid border-Gray-300 bg-green-200 relative"
            />
            {true && (
              <Box className="absolute top-7 right-0 w-[10px] h-[10px] bg-green-500 rounded-full border border-solid border-white"></Box>
            )}
          </Box>
        )}
        <Box className="flex flex-col gap-1.5">
          <Box className="flex justify-between items-center gap-4">
            <span className="font-semibold text-[14px] leading-[20px] text-Gray-700">
              {isCurrentUser ? 'You' : owner.name}
            </span>
            {!isTyping && (
              <span className="text-[12px] leading-[18px] text-Gray-600">
                {format(new Date(date), 'EEEE h:mm a')}
              </span>
            )}
          </Box>
          {content && renderMessageContent()}
          {!isTyping && (
            <>
              {files.length > 0 && renderImages()}
              {files.length > 0 && renderFileAttachments()}
              {reactionEmoji && (
                <Box className={clsx('flex gap-2', { 'justify-end': !isCurrentUser })}>
                  <Box
                    className="rounded-full p-2 bg-blue-100 w-fit cursor-pointer"
                    onClick={handleRemoveReaction}
                  >
                    {reactionEmoji}
                  </Box>
                </Box>
              )}
              {renderContextMenu()}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

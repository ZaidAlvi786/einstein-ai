import { Button, Textarea } from '@mantine/core';
import { Message as MessageComponent } from '@shared/components/TenantOverviewPanel/Message';
import {
  DefaultFileIcon,
  Delete01,
  DotsHorizontalIcon,
  FaceSmileIcon,
} from '@assets/iconComponents';
import React, { useEffect, useRef, useState } from 'react';
import { formatFileSize } from '@utils/formatFileSize';
import EmojiPicker from 'emoji-picker-react';
import { iconsByExtension } from '@constants/fileIconsByExtension.contant';

export interface Message {
  id: number;
  content?: string;
  files?: File[];
  owner: {
    id: number;
    name: string;
    avatar?: string;
  };
  date: string;
  reactionEmoji?: string;
}

const currentUser = {
  id: 12,
  name: 'John Doe',
  avatar:
    'https://s3-alpha-sig.figma.com/img/c7b2/ae72/da5c07d425431491ba6ed156512c9322?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NpsBgpPe6gl9GW4W0oMliAu0nrFViqQTxg6yL3Hyw-XO0bn04aFqs6~dv0h2xuPXJK5d1Bm38owxH0ytdYKS9k6yR-5hiE0yGuSVe83KcOqKs32z~MbGyoksOdQD5GJjOHugUzixkIVmgnV0CSDC9liN0FYeyJhcMFQdbGp2kG~kwyfOyoajQq165PFMfzcsdZ4rl3IDI3NQQNLUQgFAt0Yzxzs7ZnwBcsLc2uNvfzbgnVQyTdrUmKme1whn6LVNuz7zpWEeeze15-vgvdH7yRrSdFeKu-WlEIL1wbIFtpRKiLizwLbSgUclozBe8kEe9kiQB0c6Oq46TT-LUZCWZQ__',
};

const chatPartner = {
  id: 13,
  name: 'Joshua Wilson',
  avatar:
    'https://s3-alpha-sig.figma.com/img/c7b2/ae72/da5c07d425431491ba6ed156512c9322?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NpsBgpPe6gl9GW4W0oMliAu0nrFViqQTxg6yL3Hyw-XO0bn04aFqs6~dv0h2xuPXJK5d1Bm38owxH0ytdYKS9k6yR-5hiE0yGuSVe83KcOqKs32z~MbGyoksOdQD5GJjOHugUzixkIVmgnV0CSDC9liN0FYeyJhcMFQdbGp2kG~kwyfOyoajQq165PFMfzcsdZ4rl3IDI3NQQNLUQgFAt0Yzxzs7ZnwBcsLc2uNvfzbgnVQyTdrUmKme1whn6LVNuz7zpWEeeze15-vgvdH7yRrSdFeKu-WlEIL1wbIFtpRKiLizwLbSgUclozBe8kEe9kiQB0c6Oq46TT-LUZCWZQ__',
};

const mockMessages: Message[] = [
  {
    id: 110,
    content: 'Awesome! Thanks. I will look at this today.',
    owner: chatPartner,
    date: 'Wed Sep 02 2024 15:10:48 GMT+0200 (Central European Summer Time)',
  },
  {
    id: 111,
    content: 'hey',
    files: [
      new File(['content of the file'], 'Jan paystub.pdf', {
        type: 'application/pdf',
        lastModified: new Date('2024-01-31').getTime(),
      }),
      new File(['content of the file'], 'Eric Orozco.doc', {
        type: 'application/pdf',
        lastModified: new Date('2024-01-31').getTime(),
      }),
    ],
    owner: chatPartner,
    date: 'Wed Sep 03 2024 15:10:48 GMT+0200 (Central European Summer Time)',
  },
  {
    id: 112,
    content:
      'Hey Olivia, I have finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over.',
    owner: currentUser,
    date: 'Wed Sep 04 2024 15:10:48 GMT+0200 (Central European Summer Time)',
  },
  {
    id: 113,
    content: 'No rush though — we still have to wait for Lanas designs.',
    owner: chatPartner,
    date: 'Wed Sep 04 2024 15:10:48 GMT+0200 (Central European Summer Time)',
  },
  {
    id: 114,
    content: 'Sure thing, I will have a look today. They are looking great!',
    owner: currentUser,
    date: 'Wed Sep 04 2024 15:10:48 GMT+0200 (Central European Summer Time)',
  },
];

const fetchMessages = (): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMessages), 1000);
  });
};

const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  return messages.reduce((acc: Record<string, Message[]>, msg) => {
    const date = new Date(msg.date).toLocaleDateString(); // Format the date
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});
};

const FileItem: React.FC<{ file: File; onRemove: (file: File) => void }> = ({ file, onRemove }) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() as keyof typeof iconsByExtension;
  const FileIcon = iconsByExtension[fileExtension] || <DefaultFileIcon />;

  return (
    <div className="flex gap-3 border-[1px] border-solid border-Gray-300 rounded-[12px] py-2 px-4 cursor-pointer">
      <div className="flex items-center gap-2">
        {FileIcon}
        <div className="flex flex-col justify-between h-full">
          <div className="text-sm font-medium text-gray-700">{file.name}</div>
          <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
        </div>
      </div>
      <Delete01 onClick={() => onRemove(file)} className="text-gray-700 cursor-pointer" />
    </div>
  );
};

export const MessagePanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    fetchMessages().then((msgs) => {
      setMessages(msgs);
      setGroupedMessages(groupMessagesByDate(msgs));
      groupMessagesByDate(msgs);
      setLoading(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangeNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNewMessage(e.target.value);

  const handleFileUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prev) => [...prev, files[0]]);
    }
  };

  const handleRemoveUploadedFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setNewMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleReactEmoji = (msgId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id !== msgId ? message : { ...message, reactionEmoji: emoji }))
    );
  };

  const handleSend = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      const newMsg: Message = {
        id: Date.now(),
        content: newMessage.trim() || undefined,
        files: selectedFiles,
        owner: currentUser,
        date: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
      setSelectedFiles([]);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-[12px] shadow-md relative">
      <header className="p-6 pb-5 border-b border-solid border-Gray-200 font-semibold text-lg">
        Conversation with Mollie
      </header>
      <div className="flex flex-col gap-4 p-6 pb-8">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="flex items-center m-10 ">
              <div className="h-px flex flex-1 bg-Gray-200"></div>
              <span className="font-medium text-[14px] leading-[20px] text-Gray-600 mx-3">{date}</span>
              <div className="h-px flex flex-1 bg-Gray-200"></div>
            </div>
            {groupedMessages[date].map((msg) => (
              <MessageComponent key={msg.id} data={msg} />
            ))}
          </div>
        ))}
        {/* {messages.map((msg) => (
          <MessageComponent
            key={msg.id}
            data={msg}
            onReactEmoji={(emoji) => handleReactEmoji(msg.id, emoji)}
          />
        ))} */}
        <MessageComponent
          isTyping
          data={{ date: new Date().toString(), owner: chatPartner, id: -1, content: '...' }}
        />
      </div>
      <footer className="p-6">
        <div className="flex flex-col rounded-[8px] border-[1px] border-solid border-gray-300 py-3 px-4 gap-2 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
          <div className="flex gap-4 mb-2 flex-wrap">
            {selectedFiles.map((file) => (
              <FileItem key={file.name} file={file} onRemove={handleRemoveUploadedFile} />
            ))}
          </div>
          <Textarea
            placeholder="Send a message"
            autosize
            styles={{ input: { borderWidth: 0, boxShadow: 'none' } }}
            value={newMessage}
            onChange={handleChangeNewMessage}
          />
          <div className="relative">
            {showEmojiPicker && (
              <div className="absolute bottom-10 right-0" ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <div className="flex justify-end items-center gap-4">
              <FaceSmileIcon
                className="cursor-pointer"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              />
              <DotsHorizontalIcon className="cursor-pointer" onClick={handleFileUploadClick} />
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Button
                size="md"
                variant="outline"
                className="bg-brand-970 text-white hover:bg-brand-960 hover:text-white"
                onClick={handleSend}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

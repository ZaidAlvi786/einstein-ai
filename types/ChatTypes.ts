// src/types/globalInterfaces.ts
export interface AssistantMessage {
  response: string;
  timestamp: string;
  tool_id: string | null;
  name: string;
  [key: string]: unknown;
}

export interface AssistantRecord {
  role: "assistant";
  content: AssistantMessage[];
  type: string;
  [key: string]: unknown;
}

export interface UserMessage {
  role: "user";
  content: string;
  user_id: string;
  [key: string]: unknown;
  reply?: string;
  edited?:boolean;
  file_url?:Array<string>;
}

export type ChatResponse = [UserMessage, AssistantRecord][];

export interface ChatRecord {
  [0]: UserMessage;
  [1]: AssistantRecord;
}

export interface AssistantChatProps {
  message: AssistantRecord;
  index: number;
  setShowLoader: any;
  chatError: any;
  showGogleIcon: boolean;
  setShowReply: any;
  showReply:any;
  file_url?:Array<string>
}

export interface UserChatProps {
  message: UserMessage;
  setEditModeIndex: any;
  enterEditMode: any;
  Index: number;
}

export interface AssistantMessageVersionChangeProps {
  currentMessageVersionIndex: number;
  message: any;
  setCurrentMessageVersionIndex: (index: number) => void;
}

export interface ResponseIconButtonProps {
  message: AssistantRecord;
  currentIndex: number;
}

export interface LoaderState {
  prompt: string;
  isloading: boolean;
  index: number | null;
  attachedFiles: any;
}

export interface ChatInputProps {
  setShowLoader: React.Dispatch<
    React.SetStateAction<{
      prompt: string;
      isloading: boolean;
      index: number | null;
      attachedFiles: any;
    }>
  >;
  scrollRef: React.RefObject<HTMLDivElement>;
  showReply: any;
  setShowReply: any;
  showLoader?:any
}

export interface ChatProps {
  chatHistoryID: string;
}

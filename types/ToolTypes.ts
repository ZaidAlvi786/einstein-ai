import { AssistantRecord } from "@/types/ChatTypes";

export interface ToolLogoDetails {
    logo: string;
    name: string;
  }
  
  export interface ToolsLogoInfo {
    [key: string]: ToolLogoDetails;
  }
  
  export interface ToolStaticIdMapping {
    [key: string]: string;
  }
  
  export interface DynamicToolsSideChatPopupProps {
    onMenuToolSelection: (selectedTool: Object, data: string) => void;
    currentMessageIndex: number;
    currentMessageVersionIndex: number;
    type: string;
    message: AssistantRecord;
    onStaticToolModelClicked:any
  }
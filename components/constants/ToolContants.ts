import { ToolStaticIdMapping } from "@/types/ToolTypes";

export const toolsStaticIdMapping: ToolStaticIdMapping = {
  gemini: "6744072b6550fbc778bd0e40",
  Gemini: "6744072b6550fbc778bd0e40",
  "ChatGPT - 3.5": "674407496550fbc778bd0e41",
  "GPT-3.5": "674407496550fbc778bd0e41",
  gpt4: "674407706550fbc778bd0e42",
  GPT4: "674407706550fbc778bd0e42",
  gpt3: "674407496550fbc778bd0e41",
  "GPT-4": "674407706550fbc778bd0e42",
  "ChatGPT - 4": "674407706550fbc778bd0e42",
  mistral: "6744079d6550fbc778bd0e43",
  Mistral: "6744079d6550fbc778bd0e43",
  perplexity: "674407c46550fbc778bd0e44",
  Perplexity: "674407c46550fbc778bd0e44",
  claude: "674406b16550fbc778bd0e3e",
  Claude: "674406b16550fbc778bd0e3e",
};

export const toolLogoLocalStorageKey: string = "toolLogoList";

export const staticToolsList: string[] = [
  
];

export const socketActionsList: string[] = ["model_chat", "chat", "regenerate", "update", "edit"];

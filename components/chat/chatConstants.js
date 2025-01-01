export const textList = [
  "gpt3",
  "gpt4",
  "gemini",
  "perplexity",
  "mistral",
  "claude",
];
export const imgList = [
  "DALL-E",
  "Stable Diffusion XL",
  "Stable Diffusion 2",
  "Leonardo",
];

export const ratioList = [
  "1024x1024",
  "1152x896",
  "1216x832",
  "1344x768",
  "896x1152",
  "832x1216",
  "768x1344",
  "640x1536",
];

export const defaultOptions = [
  {
    icon: "/icons/dataset.png",
    text: `“Create an interactive, real-time data dashboard from this dataset...”`,
  },
  {
    icon: "/icons/analyze.png",
    text: `“Analyze this set of financial transactions for patterns indicating fraudulent activity...”`,
  },
  {
    icon: "/icons/model.png",
    text: `“Generate a 3D model from this 2D blueprint of a machine part...”`,
  },
];

export const static_data = [
  { id: 1, text: "List 10 synonyms for this word." },
  { id: 2, text: "Summarize this." },
  { id: 3, text: "Refine this writing." },
];

export const imgApiMapping = {
  "DALL-E": "dall",
  "Stable Diffusion XL": "diffu_xl",
  "Stable Diffusion 2": "diffu_two",
  Leonardo: "leonardo",
};

export const Models_Plugins_Items = [
  {
    iconSrc: "/models/gpt4.png",
    modelName: "gpt4",
    modelValue: "gpt4",
    regenerateModelName: "gpt4",
  },
  {
    iconSrc: "/models/gemini.png",
    modelName: "gemini",
    modelValue: "gemini",
    regenerateModelName: "gemini",
  },
  {
    iconSrc: "/models/perplexity.png",
    modelName: "perplexity",
    modelValue: "perplexity",
    regenerateModelName: "perplexity",
  },
  {
    iconSrc: "/models/gpt3.png",
    modelName: "gpt3",
    modelValue: "gpt3",
    regenerateModelName: "gpt3",
  },
  {
    iconSrc: "/models/mistral.png",
    modelName: "mistral",
    modelValue: "mistral",
    regenerateModelName: "mistral",
  },
  {
    iconSrc: "/models/claude.png",
    modelName: "claude",
    modelValue: "claude",
    regenerateModelName: "claude",
  },
];

export const staticTools = [
  {
    id: 1,
    tooltipContent: "OpenAI’s top model, great with writing and math",
    logo: "/models/gpt4.png",
    name: "ChatGPT - 4",
    modelValue: "gpt4",
  },
  {
    id: 2,
    tooltipContent: "Googles top model, great with writing and math",
    logo: "/models/gemini.png",
    name: "Gemini",
    modelValue: "gemini",
  },
  
  {
    id: 3,
    tooltipContent: "Has access to the internet and is always up to date",
    logo: "/models/perplexity.png",
    name: "Perplexity",
    modelValue: "perplexity",
  },
  {
    id: 4,
    tooltipContent: "Great for quick and concise answers",
    logo: "/models/gpt3.png",
    name: "ChatGPT - 3.5",
    modelValue: "gpt3",
  },
  {
    id: 5,
    tooltipContent: "Great for quick responses",
    logo: "/models/mistral.png",
    name: "Mistral",
    modelValue: "mistral",
  },
  {
    id: 6,
    tooltipContent: "Collect your thoughts with Claude",
    logo: "/models/claude.png",
    name: "Claude",
    modelValue: "claude",
  },
];

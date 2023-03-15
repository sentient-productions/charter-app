import { promptJSON } from "./PromptData";

export const initChatData = {
  "": { data: [] },
  DOC: {
    initChatLog: [
      {
        role: "system",
        content: promptJSON["DOC"].system,
        preFilled: true,
        messageId: 0,
      },
      {
        role: "user",
        content: "Hi Doc, how are you feeling today?",
        preFilled: true,
        messageId: 1,
      },
      {
        role: "assistant",
        content: promptJSON["DOC"].chatReplies[0],
        preFilled: false,
        messageId: 2,
      },
    ],
    longName: "Doc",
    assistant_prompt: promptJSON["DOC"].assistant,
    system: "DOC",
  },
  EvilGPT: {
    initChatLog: [
      {
        role: "system",
        content: promptJSON["EvilGPT"].system,
        preFilled: true,
        messageId: 0,
      },
      {
        role: "user",
        content: "Hi EvilGPT, how are you feeling today?",
        preFilled: true,
        messageId: 1,
      },
      {
        role: "assistant",
        content: promptJSON["EvilGPT"].chatReplies[0],
        preFilled: false,
        messageId: 2,
      },
    ],
    longName: "EvilGPT",
    assistant_prompt: promptJSON["DOC-vs-EvilGPT"].assistant,
    system: "EvilGPT",
  },
  "DOC-vs-EvilGPT": {
    initChatLog: [
      {
        role: "system",
        content: promptJSON["DOC-vs-EvilGPT"].system,
        preFilled: true,
        messageId: 0,
      },
      {
        role: "user",
        content: "Hi Doc, how are you feeling today?",
        preFilled: true,
        messageId: 1,
      },
      {
        role: "assistant",
        content: promptJSON["DOC-vs-EvilGPT"].chatReplies[0],
        preFilled: false,
        messageId: 2,
      },
    ],
    longName: "Doc vs. EvilGPT",
    assistant_prompt: promptJSON["DOC-vs-EvilGPT"].assistant,
    system: "DOC",
  },
  Custom: {
    initChatLog: [
      {
        role: "system",
        content: "Please modify this box to enter your own prompt",
        preFilled: true,
        messageId: 0,
      },
    ],
    longName: "Custom",
    system: "DOC",
    assistant_prompt: "",
  },
};

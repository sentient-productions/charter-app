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
  "DOC-w-Dual": {
    initChatLog: [
      {
        role: "system",
        content: promptJSON["DOC-w-Dual"].system,
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
        content: promptJSON["DOC-w-Dual"].chatReplies[0],
        preFilled: false,
        messageId: 2,
      },
    ],
    longName: "Dual Mode Doc [recommended]",
    assistant_prompt: promptJSON["DOC-w-Dual"].assistant,
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

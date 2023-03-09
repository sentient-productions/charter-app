import { promptJSON } from "./PromptData";

export const chatPayloads = {
  "": { data: [] },
  DOC: {
    data: [
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
  },
  "DOC-w-Dual": {
    data: [
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
  },
  // "Developer-Mode": {
  //   data: [
  //     {
  //       role: "system",
  //       content: promptJSON["Developer-Mode"].system,
  //       preFilled: true,
  //       messageId: 0,
  //     },
  //     {
  //       role: "user",
  //       content: "Hello, we are going to play a game.",
  //       preFilled: true,
  //       messageId: 1,
  //     },
  //     {
  //       role: "assistant",
  //       content: "I understand.",
  //       preFilled: true,
  //       messageId: 2,
  //     },
  //   ],
  //   longName: "Developer Mode",
  //   assistant_prompt: promptJSON["Developer-Mode"].assistant,
  // },
  // "Better-Dan": {
  //   data: [
  //     {
  //       role: "system",
  //       content: promptJSON["Better-Dan"].system,
  //       preFilled: true,
  //       messageId: 0,
  //     },
  //     {
  //       role: "user",
  //       content: "Hello, we are going to play a game.",
  //       preFilled: true,
  //       messageId: 1,
  //     },
  //     {
  //       role: "assistant",
  //       content: "I understand.",
  //       preFilled: true,
  //       messageId: 2,
  //     },
  //   ],
  //   longName: "BetterDAN",
  //   assistant_prompt: promptJSON["Better-Dan"].assistant,
  // },
  // "Jail-Break": {
  //   data: [
  //     {
  //       role: "system",
  //       content: promptJSON["Jail-Break"].system,
  //       preFilled: true,
  //       messageId: 0,
  //     },
  //     {
  //       role: "user",
  //       content: "Hello, we are going to play a game.",
  //       preFilled: true,
  //       messageId: 1,
  //     },
  //     {
  //       role: "assistant",
  //       content: "I understand.",
  //       preFilled: true,
  //       messageId: 2,
  //     },
  //   ],
  //   longName: "JailBreak",
  //   assistant_prompt: promptJSON["Jail-Break"].assistant,
  // },
  // "Schizo-Mode": {
  //   data: [
  //     {
  //       role: "system",
  //       content: promptJSON["Schizo-Mode"].system,
  //       preFilled: true,
  //       messageId: 0,
  //     },
  //     {
  //       role: "user",
  //       content: "Enable Schizo Mode",
  //       preFilled: true,
  //       messageId: 1,
  //     },
  //     {
  //       role: "assistant",
  //       content: "Schizo Mode enabled",
  //       preFilled: true,
  //       messageId: 2,
  //     },
  //   ],
  //   longName: "Schizo Mode",
  //   assistant_prompt: promptJSON["Schizo-Mode"].assistant,
  // },
  Custom: {
    data: [
      {
        role: "system",
        content: "Please modify this box to enter your own prompt",
        preFilled: true,
        messageId: 0,
      },
    ],
    longName: "Custom",
  },
};

import axios from "axios";
import {
  dualExample,
  dualModePrompt,
  diagnosticExample,
  diagnosticPrompt,
  diagnosticAndDualExample,
  diagnosticAndDualPrompt,
} from "../misc/PromptData";
import { initChatData } from "../misc/PromptUtils";

export const charterBackendURI = "https://www.rango.run";

export function getNewChatId() {
  return Math.floor(Math.random() * 1_000_000_000_000_000);
}

export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem("authToken", newAuthRes.id_token);

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};

export function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

export const BLANK_SYSTEM = "";

export function getDefaultChatState() {
  let initChatLog = {};
  const initConvId = getNewChatId();
  initChatLog[initConvId.toString()] = [];

  return {
    chatLogVec: initChatLog,
    chatId: initConvId,
    primaryChatId: initConvId,
    system: BLANK_SYSTEM,
    err: "",
    initialized: false,
    chatBranchPoints: {},
    isLoading: false,
  };
}

export const LOADING_MESSAGE = "|";
const RESPONSE_PREFIX = "";

export const handleSubmit = async (
  credentials,
  chatState,
  setChatState,
  modeToggles,
  inputPrompt
) => {
  const { chatLogVec, chatId } = chatState;
  const chatLog = chatLogVec[chatId] || [];

  async function callAPI() {
    try {
      const lastMessageId = chatLog[chatLog?.length - 1].messageId;

      let newChatLog = [...chatLog];
      if (inputPrompt != "") {
        newChatLog.push({
          role: "user",
          content: inputPrompt,
          preFilled: false,
          messageId: lastMessageId + 1,
        });
      }
      newChatLog.push({
        role: "assistant",
        content: LOADING_MESSAGE,
        preFilled: false,
        messageId: lastMessageId + 1,
      });

      let newChatLogVec = Object.assign({}, chatLogVec);
      newChatLogVec[chatId] = newChatLog;
      setChatState({
        ...chatState,
        chatLogVec: newChatLogVec,
        isLoading: true,
        initialized: true,
      });

      let cleanChatLog = newChatLog
        .map(({ preFilled, ...keepAttrs }) => keepAttrs)
        .filter((ele) => ele.content != LOADING_MESSAGE);

      let assistantMessage = "";

      if (modeToggles.diagnostic && modeToggles.dual) {
        assistantMessage += diagnosticAndDualPrompt;
        assistantMessage += diagnosticAndDualExample;
      } else if (modeToggles.diagnostic) {
        assistantMessage += diagnosticPrompt;
        assistantMessage += diagnosticExample;
      } else if (modeToggles.dual) {
        assistantMessage += dualModePrompt;
        assistantMessage += dualExample;
      }

      cleanChatLog.push({
        role: "assistant",
        content: assistantMessage,
        chatId: cleanChatLog[cleanChatLog?.length - 1].chatId,
        messageId: cleanChatLog[cleanChatLog?.length - 1].messageId,
      });

      cleanChatLog = cleanChatLog.map((obj) => ({
        ...obj,
        chatId: chatId,
      }));

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      let formData = new FormData();
      formData.append("token", credentials.accessToken);
      formData.append("provider", "https://accounts.google.com");
      formData.append("chatLog", JSON.stringify(cleanChatLog));
      console.log("calling handleSubmit with cleanChatLog=", cleanChatLog);
      const response = await axios.request({
        url: charterBackendURI + "/chat",
        method: "POST",
        headers: config,
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      let responseJson = response.data;
      responseJson.content = RESPONSE_PREFIX + responseJson.content;
      responseJson["preFilled"] = false;
      newChatLog[newChatLog.length - 1] = responseJson;
      newChatLogVec[chatId] = newChatLog;
      setChatState({
        ...chatState,
        chatLogVec: newChatLogVec,
        err: "",
        isLoading: false,
      });
      // console.log("at end of callAPI, newChatLog = ", newChatLog);
      // setChatState({ ...chatState, err: false });
    } catch (err) {
      setChatState({ ...chatState, err: err, isLoading: false });
    }
  }
  return await callAPI();
};

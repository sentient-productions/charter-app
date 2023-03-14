// Foreign
import { useContext, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Navigate } from "react-router-dom";
// Local
import "./normal.css";
import "./ChatApp.css";
import ChatBox from "../../components/chat-app/ChatBox";
import Sidebar from "../../components/chat-app/Sidebar";
import SubmitBox from "../../components/chat-app/SubmitBox";
import Navbar from "../../components/chat-app/ChatBox/Navbar";
import { getDefaultChatState, handleSubmit } from "../../utils";
import { AccountContext } from "../../contexts/account";
import { ChatsContext } from "../../contexts/chats";
import { initChatData } from "../../misc/PromptUtils";
import { charterBackendURI, BLANK_SYSTEM, timeout } from "../../utils";

export default function ChatApp() {
  const { credentials } = useContext(AccountContext);
  const { chatHistory, setChatHistory } = useContext(ChatsContext);
  const chatHistoryUser = chatHistory[credentials.email] || {};

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const messagesEndRef = useRef(null);

  const [inputPrompt, setInputPrompt] = useState("");
  const [modeToggles, setModeToggles] = useState({});

  const [chatState, setChatState] = useState(getDefaultChatState());
  const { system, chatLogVec, chatId, primaryChatId, err } = chatState;
  const chatLog = chatLogVec[chatId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (chatState.initialized == false && chatState.system != BLANK_SYSTEM) {
      let chatStateCopy = Object.assign({}, chatState);
      chatStateCopy.chatLogVec[chatId] = initChatData[system].initChatLog;
      setChatState({ ...chatStateCopy });
      if (system === "DOC-w-Dual") {
        setModeToggles({ dual: true, diagnostic: true });
      } else if (system === "DOC") {
        setModeToggles({ dual: false, diagnostic: true });
      } else {
        setModeToggles({ dual: false, diagnostic: false });
      }
    }
  }, [system]);

  useEffect(() => {
    let userChatsCopy = Object.assign({}, chatHistoryUser);
    console.log("userChatsCopy = ", userChatsCopy);
    let chatStateCopy = Object.assign({}, chatState);
    if (!chatHistory[`${primaryChatId}`]) {
      userChatsCopy[`${primaryChatId}`] = chatStateCopy;
      userChatsCopy[`${primaryChatId}`]["chatNumber"] =
        Object.keys(chatHistory).length;
    } else {
      if (chatId == primaryChatId) {
        userChatsCopy[`${primaryChatId}`].system = chatStateCopy.system;
        userChatsCopy[`${primaryChatId}`].initialized =
          chatStateCopy.initialized;
      }
      userChatsCopy[`${primaryChatId}`].chatLogVec = chatStateCopy.chatLogVec;
      userChatsCopy[`${primaryChatId}`].chatBranchPoints =
        chatStateCopy.chatBranchPoints;
    }
    console.log(
      "userChatsCopy[`${primaryChatId}`].chatLogVec = ",
      userChatsCopy[`${primaryChatId}`].chatLogVec
    );
    // turn off pre-fill so we don't get an annoying load out
    if (userChatsCopy[`${primaryChatId}`].chatLogVec[chatId]) {
      userChatsCopy[`${primaryChatId}`].chatLogVec[chatId] = userChatsCopy[
        `${primaryChatId}`
      ].chatLogVec[chatId].map((message) => {
        return { ...message, preFilled: true };
      });
    }

    console.log("setting chat history = ", userChatsCopy);
    let chatHistoryCopy = Object.assign({}, chatHistory);
    chatHistoryCopy[credentials.email] = userChatsCopy;
    setChatHistory({ ...chatHistoryCopy });
    if (chatLog.length > 0 && chatLog[chatLog.length - 1].role === "user") {
      handleSubmit(credentials, chatState, setChatState, modeToggles, "").then(
        () => {
          timeout(50).then(() => {
            scrollToBottom();
          });
        }
      );
    }
  }, [chatState]);

  return !credentials.accessToken ? (
    <Navigate to={{ pathname: "/login", state: { from: "/chat" } }} />
  ) : (
    <div className="ChatApp">
      {isMobile && <Navbar chatState={chatState} setChatState={setChatState} />}
      {!isMobile && (
        <Sidebar chatState={chatState} setChatState={setChatState} />
      )}
      <ChatBox
        chatState={chatState}
        setChatState={setChatState}
        err={err}
        messagesEndRef={messagesEndRef}
        scrollToBottom={scrollToBottom}
      />
      <SubmitBox
        chatState={chatState}
        setChatState={setChatState}
        handleSubmit={handleSubmit}
        inputPrompt={inputPrompt}
        scrollToBottom={scrollToBottom}
        setInputPrompt={setInputPrompt}
        modeToggles={modeToggles}
        setModeToggles={setModeToggles}
      />
    </div>
  );
}

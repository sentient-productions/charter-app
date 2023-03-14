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
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const messagesEndRef = useRef(null);

  const [inputPrompt, setInputPrompt] = useState("");
  const [modeToggles, setModeToggles] = useState({});

  const [chatState, setChatState] = useState(getDefaultChatState());
  const { system, chatLogVec, chatId, primaryChatId, err } = chatState;
  const chatLog = chatLogVec[chatId] || [];
  console.log("chatHistory = ", chatHistory);
  console.log("chatState = ", chatState);

  // console.log("chatLogVec = ", chatLogVec);
  // console.log("chatLog = ", chatLog);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (chatState.initialized == false && chatState.system != BLANK_SYSTEM) {
      let chatStateCopy = Object.assign({}, chatState);
      chatStateCopy.chatLogVec[chatId] = initChatData[system].initChatLog;
      setChatState({ ...chatStateCopy, initialized: true });
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
    let chatsCopy = Object.assign({}, chatHistory);
    let chatStateCopy = Object.assign({}, chatState);
    if (!chatHistory[`${primaryChatId}`]) {
      let chatsContainer = {};
      chatsCopy[`${primaryChatId}`] = chatStateCopy;
      chatsCopy[`${primaryChatId}`]["chatNumber"] =
        Object.keys(chatHistory).length;
    } else {
      if (chatId == primaryChatId) {
        chatsCopy[`${primaryChatId}`].system = chatStateCopy.system;
        chatsCopy[`${primaryChatId}`].initialized = chatStateCopy.initialized;
      }
      chatsCopy[`${primaryChatId}`].chatLogVec = chatStateCopy.chatLogVec;
      chatsCopy[`${primaryChatId}`].chatBranchPoints =
        chatStateCopy.chatBranchPoints;
    }
    console.log(
      "chatsCopy[`${primaryChatId}`].chatLogVec = ",
      chatsCopy[`${primaryChatId}`].chatLogVec
    );
    // turn off pre-fill so we don't get an annoying load out
    if (chatsCopy[`${primaryChatId}`].chatLogVec[chatId]) {
      chatsCopy[`${primaryChatId}`].chatLogVec[chatId] = chatsCopy[
        `${primaryChatId}`
      ].chatLogVec[chatId].map((message) => {
        return { ...message, preFilled: true };
      });
    }

    setChatHistory(chatsCopy);
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
      {isMobile && <Navbar />}
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

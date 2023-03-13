import { useMediaQuery } from "react-responsive";
// Foreign
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// Local
import "./normal.css";
import "./ChatApp.css";
import ChatBox from "../../components/chat-app/ChatBox";
import Sidebar from "../../components/chat-app/Sidebar";
import SubmitBox from "../../components/chat-app/SubmitBox";
import Navbar from "../../components/chat-app/ChatBox/Navbar";

import { chatPayloads } from "../../misc/PromptUtils";
import { getNewConversationId } from "../../utils";
import {
  dualExample,
  dualModePrompt,
  diagnosticExample,
  diagnosticPrompt,
  diagnosticAndDualExample,
  diagnosticAndDualPrompt,
} from "../../misc/PromptData";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AccountContext } from "../../contexts/account";
import { ChatsContext } from "../../contexts/chats";
import { charterBackendURI } from "../../utils";

const RESPONSE_PREFIX = "";
const LOADING_MESSAGE = "...";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function ChatApp() {
  const [system, setSystem] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const { credentials } = useContext(AccountContext);
  const { chats, setChats } = useContext(ChatsContext);
  console.log("chats = ", chats);

  const initConvId = getNewConversationId();
  let initChatLog = {};
  console.log("system=", system);
  initChatLog[initConvId.toString()] = chatPayloads[system]["data"];
  console.log("initChatLog = ", initChatLog);
  const [chatLogVec, setChatLogVec] = useState(initChatLog);
  const [selectedChatId, setSelectedChatId] = useState(initConvId);

  useEffect(() => {
    let chatsCopy = Object.assign({}, chats);
    if (selectedChatId) {
      chatsCopy[`${selectedChatId}`] = chatLogVec;
      chatsCopy[`${selectedChatId}_system`] = system;
    }
    setChats(chatsCopy);
  }, [chatLogVec]);
  const [err, setErr] = useState(false);
  const [modeToggles, setModeToggles] = useState({});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  useEffect(() => {
    delay(50).then(() => {
      scrollToBottom();
    });
  }, [setChatLogVec]);

  useEffect(() => {
    let chatLogVecCopy = Object.assign({}, chatLogVec);
    chatLogVecCopy[selectedChatId] = chatPayloads[system]["data"];
    setChatLogVec(chatLogVecCopy);
    if (system === "DOC-w-Dual") {
      setModeToggles({ dual: true, diagnostic: true });
    } else if (system === "DOC") {
      setModeToggles({ dual: false, diagnostic: true });
    } else {
      setModeToggles({ dual: false, diagnostic: false });
    }
  }, [system]);

  useEffect(() => {
    console.log("we are in the submission use effect");
    console.log("selectedChatId=", selectedChatId);
    console.log("chatLogVec=", chatLogVec);
    if (
      chatLogVec?.selectedChatId?.length > 0 &&
      chatLogVec?.selectedChatId[chatLogVec[selectedChatId]?.length - 1]
        ?.role === "user"
    ) {
      console.log("we are handling a chat log submit.");
      handleSubmit(null, chatLogVec[selectedChatId]).then((responseJson) => {
        if (responseJson) {
          let newChatLogVec = { ...chatLogVec };
          newChatLogVec[selectedChatId].push(responseJson);
          // newChatLogVec[selectedChatId] = newChatLog;
          setChatLogVec(newChatLogVec);
          delay(50).then(() => {
            scrollToBottom();
          });
        }
      });
    }
  }, [selectedChatId]);

  const handleSubmit = async (e, newChatLog) => {
    // e.preventDefault();
    async function callAPI() {
      console.log("we are trying to call the api");
      try {
        let cleanChatLog = newChatLog
          .map(({ preFilled, ...keepAttrs }) => keepAttrs)
          .filter((ele) => ele.content != LOADING_MESSAGE);

        cleanChatLog[cleanChatLog?.length - 1].content =
          cleanChatLog[cleanChatLog?.length - 1].content;

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
          chatId: selectedChatId,
        }));
        console.log("cleanChatLog = ", cleanChatLog);

        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        let formData = new FormData();
        formData.append("token", credentials.accessToken);
        formData.append("provider", "https://accounts.google.com");
        formData.append("chatLog", JSON.stringify(cleanChatLog));

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
        console.log("raw response = ", responseJson.content);
        responseJson.content = RESPONSE_PREFIX + responseJson.content;
        responseJson["preFilled"] = false;
        setErr(false);
        return responseJson;
      } catch (err) {
        setErr(err);
      }
    }
    return await callAPI();
  };
  return !credentials.accessToken ? (
    <Navigate to={{ pathname: "/login", state: { from: "/chat" } }} />
  ) : (
    <div className="ChatApp">
      {isMobile && <Navbar />}
      {!isMobile && (
        <Sidebar
          chatLog={chatLogVec?.selectedChatId}
          system={system}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          setChatLogVec={setChatLogVec}
          setSystem={setSystem}
        />
      )}
      <ChatBox
        chatLog={chatLogVec[selectedChatId]}
        chatLogVec={chatLogVec}
        err={err}
        messagesEndRef={messagesEndRef}
        scrollToBottom={scrollToBottom}
        selectedChatId={selectedChatId}
        setChatLogVec={setChatLogVec}
        setSelectedChatId={setSelectedChatId}
        system={system}
        setSystem={setSystem}
      />
      <SubmitBox
        chatLog={chatLogVec[selectedChatId]}
        chatLogVec={chatLogVec}
        handleSubmit={handleSubmit}
        inputPrompt={inputPrompt}
        scrollToBottom={scrollToBottom}
        selectedChatId={selectedChatId}
        setChatLogVec={setChatLogVec}
        setInputPrompt={setInputPrompt}
        system={system}
        modeToggles={modeToggles}
        setModeToggles={setModeToggles}
      />
    </div>
  );
}

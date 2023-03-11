import { useMediaQuery } from "react-responsive";
// Foreign
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// Local
import "./normal.css";
import "./ChatApp.css";
import ChatBox from "../../components/chat-app/ChatBox";
import Menu from "../../components/chat-app/Menu";
import Sidebar from "../../components/chat-app/Sidebar";
import SubmitBox from "../../components/chat-app/SubmitBox";
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

const RESPONSE_PREFIX = "";
const LOADING_MESSAGE = "...";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function ChatApp() {
  const [showMenu, setShowMenu] = useState(false);
  const [system, setSystem] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const initConvId = getNewConversationId();
  let initChatLog = {};
  initChatLog[initConvId.toString()] = chatPayloads[system]["data"];

  const [chatLogVec, setChatLogVec] = useState(initChatLog);
  const [selectedChatId, setSelectedChatId] = useState(initConvId);
  const [err, setErr] = useState(false);
  const [modeToggles, setModeToggles] = useState({});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView(); //{ behavior: "smooth" });
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
    if (
      chatLogVec[selectedChatId].length > 0 &&
      chatLogVec[selectedChatId][chatLogVec[selectedChatId].length - 1].role ===
        "user"
    ) {
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
      try {
        let formData = new FormData();
        let cleanChatLog = newChatLog
          .map(({ preFilled, ...keepAttrs }) => keepAttrs)
          .filter((ele) => ele.content != LOADING_MESSAGE);

        cleanChatLog[cleanChatLog.length - 1].content =
          cleanChatLog[cleanChatLog.length - 1].content;

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
          chatId: cleanChatLog[cleanChatLog.length - 1].chatId,
          messageId: cleanChatLog[cleanChatLog.length - 1].messageId,
        });

        cleanChatLog = cleanChatLog.map((obj) => ({
          ...obj,
          chatId: selectedChatId,
        }));
        console.log("cleanChatLog = ", cleanChatLog);
        formData.append("chatLog", JSON.stringify(cleanChatLog));

        URL = "https://www.rango.run/chat";
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        const response = await axios.request({
          url: URL,
          method: "POST",
          headers: config,
          data: formData,
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
  const { credentials, setCredentials } = useContext(AccountContext);
  console.log("credentials = ", credentials);
  return !credentials.accessToken ? (
    <Navigate to={{ pathname: "/login", state: { from: "/chat" } }} />
  ) : (
    <div className="ChatApp">
      {showMenu && (
        <Menu
          chatLog={chatLogVec[selectedChatId]}
          setChatLog={setChatLogVec}
          setShowMenu={setShowMenu}
        />
      )}
      {!isMobile && (
        <Sidebar chatLog={chatLogVec[selectedChatId]} system={system} />
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

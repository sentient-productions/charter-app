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
import { chatPayloads } from "../../misc/Prompts";
import { getNewConversationId } from "../../utils";

const RESPONSE_PREFIX = "";
const LOADING_MESSAGE = "...";

export default function ChatApp() {
  const [showMenu, setShowMenu] = useState(false);
  const [system, setSystem] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const initConvId = getNewConversationId();
  let initChatLog = {};
  initChatLog[initConvId.toString()] = chatPayloads[system]["data"];

  const [chatLogVec, setChatLogVec] = useState(initChatLog);
  console.log("chatLogVec=", chatLogVec);
  const [selectedChatId, setSelectedChatId] = useState(initConvId);
  console.log("selectedChatId=", selectedChatId);
  const [err, setErr] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [setChatLogVec]);

  useEffect(() => {
    let chatLogVecCopy = Object.assign({}, chatLogVec);
    chatLogVecCopy[selectedChatId] = chatPayloads[system]["data"];
    setChatLogVec(chatLogVecCopy);
  }, [system]);

  useEffect(() => {
    console.log("chatLogVec[selectedChatId] =", chatLogVec[selectedChatId]);
    if (
      chatLogVec[selectedChatId].length > 0 &&
      chatLogVec[selectedChatId][chatLogVec[selectedChatId].length - 1].role ===
        "user"
    ) {
      console.log("handlign submit..");
      handleSubmit(null, chatLogVec[selectedChatId]).then((responseJson) => {
        console.log("done");
        if (responseJson) {
          let newChatLogVec = { ...chatLogVec };
          newChatLogVec[selectedChatId].push(responseJson);
          console.log("newChatLogVec= ", newChatLogVec);
          // newChatLogVec[selectedChatId] = newChatLog;
          setChatLogVec(newChatLogVec);
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
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
        cleanChatLog.push({
          role: "assistant",
          content: chatPayloads[system]["assistant_prompt"],
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

  return (
    <div className="ChatApp">
      {showMenu && (
        <Menu
          chatLog={chatLogVec[selectedChatId]}
          setChatLog={setChatLogVec}
          setShowMenu={setShowMenu}
        />
      )}
      <Sidebar chatLog={chatLogVec[selectedChatId]} system={system} />
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
      />
    </div>
  );
}

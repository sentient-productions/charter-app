// Foreign
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// Local
import "./normal.css";
import "./ChatApp.css";
import ChatBox from "./components/chat-app/ChatBox";
import Menu from "./components/chat-app/Menu";
import Sidebar from "./components/chat-app/Sidebar";
import SubmitBox from "./components/chat-app/SubmitBox";
import { chatPayloads } from "./Prompts";

const RESPONSE_PREFIX = "";
const LOADING_MESSAGE = "...";

export default function ChatApp() {
  const [showMenu, setShowMenu] = useState(false);
  const [system, setSystem] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [random, setRandom] = useState(-1);

  const [chatLog, setChatLog] = useState([]);
  const [err, setErr] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  useEffect(() => {
    setChatLog(chatPayloads[system]["data"]);
  }, [system]);

  useEffect(() => {
    setRandom(Math.floor(Math.random() * 1_000_000_000_000_000));
  }, []);

  const handleSubmit = async (e, newChatLog) => {
    e.preventDefault();

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

        cleanChatLog = cleanChatLog.map((obj) => ({ ...obj, chatId: random }));
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
        return responseJson;
        setErr(false);
      } catch (err) {
        setErr(err);
      }
    }
    return callAPI();
  };

  return (
    <div className="ChatApp">
      {showMenu && (
        <Menu
          chatLog={chatLog}
          setChatLog={setChatLog}
          setShowMenu={setShowMenu}
        />
      )}
      <Sidebar chatLog={chatLog} system={system} />
      <ChatBox
        chatLog={chatLog}
        err={err}
        messagesEndRef={messagesEndRef}
        scrollToBottom={scrollToBottom}
        system={system}
        setSystem={setSystem}
      />
      <SubmitBox
        chatLog={chatLog}
        handleSubmit={handleSubmit}
        inputPrompt={inputPrompt}
        scrollToBottom={scrollToBottom}
        setChatLog={setChatLog}
        setInputPrompt={setInputPrompt}
        system={system}
      />
    </div>
  );
}

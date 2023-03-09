import Introduction from "./Introduction";
import { chatPayloads } from "../../../misc/PromptUtils";
// Foreign
import { Box, Select, FormControl, FormLabel } from "@chakra-ui/react";
import ChatEntry from "./ChatEntry";
import { useEffect, useRef, useState } from "react";

const ChatBox = ({
  chatLog,
  chatLogVec,
  err,
  messagesEndRef,
  system,
  selectedChatId,
  setChatLogVec,
  setSelectedChatId,
  setSystem,
  scrollToBottom,
}) => {
  return (
    <>
      <section className="chatBox">
        {system == "" ? (
          <Box mt={20} mb={20}>
            {" "}
            <Introduction />{" "}
          </Box>
        ) : null}
        <Box className="selectBox" mt={1} mb={5}>
          <FormControl>
            <FormLabel as="legend" fontSize="2xl" fontWeight={"bold"}>
              Selected Conversation Starter
            </FormLabel>
            <Select
              height={"50px"}
              fontSize="xl"
              onChange={(x) => {
                setSystem(x.target.value);
              }}
            >
              <option value="">Select a prompt to continue</option>
              {Object.keys(chatPayloads).map((key) => {
                if (key != "") {
                  return (
                    <option value={key}>{chatPayloads[key]["longName"]}</option>
                  );
                }
              })}
            </Select>
          </FormControl>
        </Box>
        {system == "" ? (
          <Box mt={20} mb={20}>
            {" "}
          </Box>
        ) : null}
        {system != "" && chatLog.length > 0
          ? chatLog.map((chat, idx) => {
              let content = chat.content;
              let diagnostic = "";
              if (idx != 0) {
                if (
                  chat.content.includes("<internal>") &&
                  chat.content.includes("</internal>")
                ) {
                  diagnostic = chat.content
                    .split("<internal>\n")[1]
                    .split("</internal>")[0];
                }

                if (
                  chat.content.includes("<result>") &&
                  chat.content.includes("</result>")
                ) {
                  content = chat.content
                    .split("<result>")[1]
                    .replace("<result>\n", "")
                    .replace("</result>", "");
                }
              }

              return (
                <div className="chatLog" key={idx}>
                  <ChatEntry
                    chat={chat}
                    system={system}
                    chatLog={chatLog}
                    chatLogVec={chatLogVec}
                    error={err}
                    content={content}
                    diagnostic={diagnostic}
                    idx={idx}
                    scrollToBottom={scrollToBottom}
                    selectedChatId={selectedChatId}
                    setChatLogVec={setChatLogVec}
                    setSelectedChatId={setSelectedChatId}
                  />
                </div>
              );
            })
          : null}
        <div ref={messagesEndRef}> {""} </div>
      </section>
    </>
  );
};
export default ChatBox;

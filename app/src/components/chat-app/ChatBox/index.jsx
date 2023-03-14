import Introduction from "./Introduction";
import { initChatData } from "../../../misc/PromptUtils";
// Foreign
import { Box, Select, FormControl, FormLabel } from "@chakra-ui/react";
import ChatEntry from "./ChatEntry";

const ChatBox = ({
  chatState,
  err,
  messagesEndRef,
  setChatState,
  scrollToBottom,
}) => {
  const { system, chatLogVec, chatId, primaryChatId, initialized } = chatState;
  const chatLog = chatLogVec[chatId] || [];
  console.log("chatState = ", chatState);
  return (
    <>
      <section className="chatBox">
        {chatLog.length == 0 ? (
          <Box mt={20} mb={20}>
            {" "}
            <Introduction />{" "}
          </Box>
        ) : null}
        <Box className="selectBox" mt={1} mb={5}>
          <FormControl key={primaryChatId}>
            <FormLabel as="legend" fontSize="2xl" fontWeight={"bold"}>
              Selected Conversation Starter
            </FormLabel>
            <Select
              height={"50px"}
              fontSize="xl"
              onChange={(x) => {
                setChatState({ ...chatState, system: x.target.value });
              }}
              isDisabled={initialized}
            >
              <option value="">Select a prompt to continue</option>
              {Object.keys(initChatData).map((key) => {
                if (key != "") {
                  return (
                    <option value={key}>{initChatData[key]["longName"]}</option>
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

                if (chat.content.includes("<result>")) {
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
                    chatState={chatState}
                    setChatState={setChatState}
                    error={err}
                    content={content}
                    diagnostic={diagnostic}
                    idx={idx}
                    scrollToBottom={scrollToBottom}
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

import Introduction from "./Introduction";
// Foreign
import { Box } from "@chakra-ui/react";
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
  return (
    <>
      <section className="chatBox">
        {chatLog.length == 0 ? (
          <Box mb={-10} pl={2} pr={2}>
            {" "}
            <Introduction
              primaryChatId={primaryChatId}
              initialized={initialized}
              chatState={chatState}
              setChatState={setChatState}
            />{" "}
          </Box>
        ) : null}
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

                  if (content.includes("</internal>")) {
                    content = content.split("</internal>")[1];
                  }
                }
              }
              return system != "DOC-vs-EvilGPT" ||
                chat.role != "assistant" ||
                !content.includes("</Doc>") ? (
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
              ) : (
                <div className="chatLog" key={idx}>
                  <ChatEntry
                    chat={chat}
                    chatState={chatState}
                    setChatState={setChatState}
                    error={err}
                    content={content.split("</Doc>")[0].trim()}
                    diagnostic={diagnostic}
                    idx={idx}
                    scrollToBottom={scrollToBottom}
                  />
                  <ChatEntry
                    chat={chat}
                    chatState={chatState}
                    setChatState={setChatState}
                    error={err}
                    content={content.split("</Doc>")[1].trim()}
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

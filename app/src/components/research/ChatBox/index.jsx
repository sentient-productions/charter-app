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
        <Box mb={-10} pl={2} pr={2}>
          {" "}
          <Introduction
            primaryChatId={primaryChatId}
            initialized={initialized}
            chatState={chatState}
            setChatState={setChatState}
          />{" "}
        </Box>
        <div ref={messagesEndRef}> {""} </div>
      </section>
    </>
  );
};
export default ChatBox;

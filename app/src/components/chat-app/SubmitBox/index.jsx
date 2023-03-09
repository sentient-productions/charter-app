import {
  Input,
  Box,
  Flex,
  Center,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { getNewConversationId } from "../../../utils";
import { FaEnvelopeOpenText } from "react-icons/fa";

const LOADING_MESSAGE = "...";

const SubmitBox = ({
  chatLog,
  chatLogVec,
  selectedChatId,
  handleSubmit,
  inputPrompt,
  scrollToBottom,
  setChatLogVec,
  setInputPrompt,
  system,
}) => {
  const submitMessage = async (e) => {
    console.log("inputPrompt=", inputPrompt);
    if (inputPrompt != "") {
      const lastMessageId = chatLog[chatLog.length - 1].messageId;

      let newChatLog = [
        ...chatLog,
        {
          role: "user",
          content: inputPrompt,
          preFilled: false,
          messageId: lastMessageId + 1,
        },
        {
          role: "assistant",
          content: LOADING_MESSAGE,
          preFilled: false,
          messageId: lastMessageId + 1,
        },
      ];

      let newChatLogVec = { ...chatLogVec };
      newChatLogVec[selectedChatId] = newChatLog;
      setChatLogVec(newChatLogVec);
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(5);
      scrollToBottom();
      setInputPrompt("");
      let responseJson = await handleSubmit(e, newChatLog);
      if (responseJson) {
        let newChatLogVec = { ...chatLogVec };
        newChatLog[newChatLog.length - 1] = responseJson;
        newChatLogVec[selectedChatId] = newChatLog;
        setChatLogVec(newChatLogVec);
        await delay(50);
        scrollToBottom();
      }
    } else {
      return;
    }
  };

  return (
    <div className="inputPromptWrapper">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitMessage();
        }}
      >
        <Flex height={"10vh"} alignContent={"center"} justifyContent={"center"}>
          <Center>
            <InputGroup>
              <Input
                placeholder="Message"
                size="lg"
                width="70vw"
                maxWidth={"1000px"}
                backgroundColor="#212121"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={system == ""}
                autoFocus
              />
              <InputRightElement
                children={
                  <FaEnvelopeOpenText
                    disabled={system == "" || inputPrompt == ""}
                    onClick={submitMessage}
                  />
                }
              />
            </InputGroup>

            {/* <input
              width={"500px"}
              id=""
              className="inputPrompttTextarea"
              type="text"
              rows="1"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              autoFocus
              disabled={system == ""}
            ></input> */}
          </Center>
        </Flex>
      </form>
    </div>
  );
};

export default SubmitBox;

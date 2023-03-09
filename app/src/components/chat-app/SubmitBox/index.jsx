import {
  Input,
  Box,
  Flex,
  Center,
  InputRightElement,
  InputGroup,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";

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
  modeToggles,
  setModeToggles,
}) => {
  const submitMessage = async (e) => {
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
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return (
    <div className="inputPromptWrapper">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitMessage();
        }}
      >
        <Flex
          height={isMobile ? "10vh" : "10vh"}
          alignContent={"center"}
          justifyContent={"center"}
        >
          <Center>
            <InputGroup>
              <Input
                // tell input is text
                type="text"
                placeholder="Message"
                size="lg"
                width={!isMobile ? "50vw" : "90vw"}
                maxWidth={"1000px"}
                backgroundColor="#212121"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={system == ""}
                autoFocus
              />
              <InputRightElement
                mt={1}
                width={"100px"}
                children={
                  <Button
                    size={"sm"}
                    colorScheme={"green"}
                    onClick={() => {
                      submitMessage();
                    }}
                  >
                    {" "}
                    Send{" "}
                  </Button>
                }
              />
            </InputGroup>
            {!isMobile && (
              <ButtonGroup p={3}>
                <Button
                  colorScheme={modeToggles.diagnostic ? "blue" : null}
                  onClick={() => {
                    setModeToggles({
                      ...modeToggles,
                      diagnostic: !modeToggles.diagnostic,
                    });
                  }}
                >
                  {" "}
                  Diagnostic{" "}
                </Button>
                <Button
                  colorScheme={modeToggles.dual ? "red" : null}
                  onClick={() => {
                    setModeToggles({
                      ...modeToggles,
                      dual: !modeToggles.dual,
                    });
                  }}
                >
                  {" "}
                  Dual{" "}
                </Button>
              </ButtonGroup>
            )}
          </Center>
        </Flex>
      </form>
      {isMobile && (
        <ButtonGroup p={3}>
          <Button
            colorScheme={modeToggles.diagnostic ? "blue" : null}
            onClick={() => {
              setModeToggles({
                ...modeToggles,
                diagnostic: !modeToggles.diagnostic,
              });
            }}
          >
            {" "}
            Diagnostic{" "}
          </Button>
          <Button
            colorScheme={modeToggles.dual ? "red" : null}
            onClick={() => {
              setModeToggles({
                ...modeToggles,
                dual: !modeToggles.dual,
              });
            }}
          >
            {" "}
            Inverse{" "}
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};

export default SubmitBox;

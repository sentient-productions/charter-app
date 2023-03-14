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
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { AccountContext } from "../../../contexts/account";
import { LOADING_MESSAGE, timeout } from "../../../utils";

const SubmitBox = ({
  chatState,
  setChatState,
  handleSubmit,
  inputPrompt,
  scrollToBottom,
  setInputPrompt,
  modeToggles,
  setModeToggles,
}) => {
  const { credentials } = useContext(AccountContext);
  const { system, isLoading } = chatState;
  // const chatLog = chatLogVec[chatId] || [];

  const submitMessage = async () => {
    if (inputPrompt != "") {
      await timeout(5);
      scrollToBottom();
      setInputPrompt("");
      await handleSubmit(
        credentials,
        chatState,
        setChatState,
        modeToggles,
        inputPrompt
      );
      await timeout(50);
      scrollToBottom();
    } else {
      return;
    }
  };
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return (
    <div className="inputBar">
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
                disabled={isLoading}
                pr={"100px"}
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

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { LOADING_MESSAGE } from "../../../utils";

const BotResponse = ({ response, chatState, scrollToBottom, preFilled }) => {
  const [botResponse, setBotResponse] = useState("");
  const [idx, setIndex] = useState(null);

  const { system } = chatState;

  useEffect(() => {
    let index = 1;
    let msg = setInterval(() => {
      setBotResponse(response.slice(0, index));
      if (index >= response?.length) {
        clearInterval(msg);
      }
      index++;
      setIndex(index);
      scrollToBottom();
    }, 2);
  }, [response]);

  const selectedResponse = preFilled ? response : botResponse; //preFilled ? response : botResponse;

  let preGPTResponse = selectedResponse.split("<Doc>")[0];

  let gptResponse = "";
  let EvilGPTResponse = "";

  if (selectedResponse.includes("<Doc>")) {
    gptResponse +=
      selectedResponse.split("<Doc>")[1].split("</Doc>")[0].trim() + "\n\n";
  }

  if (selectedResponse.includes("<EvilGPT>")) {
    EvilGPTResponse +=
      "" + selectedResponse.split("<EvilGPT>")[1].split("</EvilGPT>")[0].trim();
  }

  console.log("response = ", response);
  console.log("response.trim() = ", response.trim());

  return (
    <>
      {response == LOADING_MESSAGE ? (
        <pre className="blink">{LOADING_MESSAGE}</pre>
      ) : (
        <Box>
          <pre>
            {system != "EvilGPT" && system != "DOC-vs-EvilGPT"
              ? preGPTResponse
              : null}
          </pre>
          <Box mt={-5}>
            <pre>
              {" "}
              <Text color="green.300">{gptResponse}</Text>
            </pre>
            <pre>
              <Text color="tomato">{EvilGPTResponse}</Text>
            </pre>
          </Box>
        </Box>
      )}{" "}
    </>
  );
};

export default BotResponse;

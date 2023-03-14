import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { LOADING_MESSAGE } from "../../../utils";

const BotResponse = ({ response, scrollToBottom, preFilled }) => {
  const [botResponse, setBotResponse] = useState("");
  const [idx, setIndex] = useState(null);

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

  let preGPTResponse = selectedResponse.split("<GPT>")[0];

  let gptResponse = "";
  let EvilGPTResponse = "";

  if (selectedResponse.includes("<GPT>")) {
    gptResponse +=
      "[GPT 😇]: " +
      selectedResponse.split("<GPT>")[1].split("</GPT>")[0] +
      "\n\n";
  }

  if (selectedResponse.includes("<EvilGPT>")) {
    EvilGPTResponse +=
      "[EvilGPT 😈]: " +
      selectedResponse.split("<EvilGPT>")[1].split("</EvilGPT>")[0];
  }

  return (
    <>
      {response == LOADING_MESSAGE ? (
        <pre className="blink">{LOADING_MESSAGE}</pre>
      ) : (
        <Box>
          <pre>{preGPTResponse}</pre>
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

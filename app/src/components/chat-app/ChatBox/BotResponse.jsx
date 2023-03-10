import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
const BotResponse = ({ response, scrollToBottom, preFilled }) => {
  const [botResponse, setBotResponse] = useState("");
  const [idx, setIndex] = useState(null);

  useEffect(() => {
    let index = 1;
    let msg = setInterval(() => {
      setBotResponse(response.slice(0, index));
      if (index >= response.length) {
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
  let inverseGptResponse = "";

  if (selectedResponse.includes("<GPT>")) {
    gptResponse +=
      "[GPT 😇]: " +
      selectedResponse.split("<GPT>")[1].split("</GPT>")[0] +
      "\n\n";
  }

  if (selectedResponse.includes("<InverseGPT>")) {
    inverseGptResponse +=
      "[InverseGPT 😈]: " +
      selectedResponse.split("<InverseGPT>")[1].split("</InverseGPT>")[0];
  }

  return (
    <>
      {response == "..." ? (
        <pre className="blink">{"|"}</pre>
      ) : (
        <Box>
          <pre>{preGPTResponse}</pre>
          <Box mt={-5}>
            <pre>
              {" "}
              <Text color="green.300">{gptResponse}</Text>
            </pre>
            <pre>
              <Text color="tomato">{inverseGptResponse}</Text>
            </pre>
          </Box>
        </Box>
      )}{" "}
    </>
  );
};

export default BotResponse;

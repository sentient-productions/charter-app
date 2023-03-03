import React, { useEffect } from "react";
import { useState } from "react";

const BotResponse = ({ response, scroller }) => {
  const [botResoponse, setBotResponse] = useState("");

  useEffect(() => {
    let index = 1;
    let msg = setInterval(() => {
      setBotResponse(response.slice(0, index));
      if (index >= response.length) {
        clearInterval(msg);
      }
      index++;
      scroller();
    }, 2);
  }, [response]);


  return (
    response == "..." ?
    <pre className="blink">
      {"|"}
    </pre>
    :
    <pre>
    {botResoponse}
    </pre>
  );
};

export default BotResponse;

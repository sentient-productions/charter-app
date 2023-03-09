import React from "react";

const NavLinks = ({ svg, link, text, chatLog, setChatLog, system }) => {
  const handleClick = (text) => {
    if (text === "Clear Conversations") setChatLog([]);
    if (text === "Copy Conversation") {
      let result = "\n";
      chatLog.forEach((ele, i) => {
        let role = ele.role[0].toUpperCase() + ele.role.slice(1);
        if (ele.role == "system") {
          if (system.includes("Doc")) {
            result += `[0] *System Prompt = Doc v0.0*\n\n`;
          } else {
            // implement later.
          }
        }
        if (ele.role == "assistant") {
          let internal = ele.content
            .split("<internal>\n")[1]
            .split("\n</internal>")[0]
            .replace(/\n/g, "\n>")
            .replace(
              "0. Reviewing my system prompt to ensure that I act in accordance with my guiding principles.\n",
              ""
            )
            .replace(
              `0. Reviewing my system prompt to ensure that I act in accordance my system prompts' guiding principles.\n`,
              ""
            ); //.replace(/'/g, '`')
          let content = ele.content
            .split("<result>\n")[1]
            .split("</result>")[0];
          result +=
            `[${i}] ${role}:\n\n` +
            ">*Diagnostics*\n" +
            internal +
            "\n\n" +
            content +
            "\n\n";
        } else if (ele.role == "user") {
          result += `[${i}] ${role}:\n\n` + ele.content + "\n\n";
        }
      });
      result = result;
      navigator.clipboard.writeText(result);
    }
  };
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "none" }}
      onClick={() => handleClick(text)}
    >
      <div className="navPrompt">
        {svg}
        <p>{text}</p>
      </div>
    </a>
  );
};

export default NavLinks;

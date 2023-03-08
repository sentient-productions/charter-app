const LOADING_MESSAGE = "...";

const SubmitBox = ({
  chatLog,
  handleSubmit,
  inputPrompt,
  scrollToBottom,
  setChatLog,
  setInputPrompt,
  system,
}) => {
  return (
    <div className="inputPromptWrapper">
      <form
        onSubmit={async (e) => {
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
          setChatLog(newChatLog);
          setInputPrompt(" ");
          let responseJson = await handleSubmit(e, newChatLog);
          setInputPrompt("");
          if (responseJson) {
            newChatLog[newChatLog.length - 1] = responseJson;
            setChatLog(newChatLog);
            const delay = (ms) => new Promise((res) => setTimeout(res, ms));
            await delay(50);
            scrollToBottom();
          }
        }}
      >
        <input
          id=""
          className="inputPrompttTextarea"
          type="text"
          rows="1"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          autoFocus
          disabled={system == ""}
        ></input>
        <p></p>
      </form>
    </div>
  );
};

export default SubmitBox;

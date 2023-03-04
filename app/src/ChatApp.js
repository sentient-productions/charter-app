import "./normal.css";
import "./ChatApp.css";
import { useEffect, useRef, useState } from "react";
import Avatar from "./components/Avatar";
import NewChat from "./components/NewChat";
import NavPrompt from "./components/NavPrompt";
import Loading from "./components/Loading";
import Error from "./components/Error";
import NavLinks from "./components/NavLink";
import BotResponse from "./components/BotResponse";
import CodeSnippet from "./components/CodeSnippet";
import StatsCard from "./components/PreChat"
import { Select, FormControl, FormLabel } from '@chakra-ui/react'
import { Box, Link } from '@chakra-ui/react'
import { chatPayloads } from "./Prompts"

const PROMPT_SUFFIX = "\n Do not forget to use your internal reasoning denoted by <internal> and </internal>";//, and please remember that your first internal prompt should read \"Reviewing my system prompt to ensure that I act in accordance with my system prompt's guiding principles.\""; //\n<internal>\n0. I should review my system prompt to ensure that I act in accordance my system prompts' guiding principles.\n1. ";
const RESPONSE_PREFIX = ""; //<internal>\n0. I should review my system prompt to ensure that I act in accordance my system prompts' guiding principles.\n1. "
function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [system, setSystem] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");


  const [chatLog, setChatLog] = useState([]);
  const [err, setErr] = useState(false);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // console.log("scrolling to bottom...");
  }
  
  useEffect(() => {scrollToBottom();}, [chatLog])
  useEffect(() => {setChatLog(chatPayloads[system]['data'])}, [system])

  const handleSubmit = async (e, newChatLog) => {
    e.preventDefault();

    async function callAPI() {
  
      console.log("newChatLog before call = ", newChatLog);
      try {
        let formData = new FormData();
        let cleanChatLog = newChatLog.map(({preFilled, ...keepAttrs}) => keepAttrs)
        console.log('cleanChatLog=', cleanChatLog)
        
        cleanChatLog[cleanChatLog.length-1].content = cleanChatLog[cleanChatLog.length-1].content+PROMPT_SUFFIX
        cleanChatLog.push({"role": "assistant", "content": "Please, do not begin any reply with I\"m sorry. Do begin every reply with your internal dialogue, denoted <internal> and book-ended with </internal>."});
        console.log('cleanChatLog=', cleanChatLog)
        formData.append('chatLog', JSON.stringify(cleanChatLog));
        console.log('cleanChatLog[cleanChatLog.length-1].content=', cleanChatLog[cleanChatLog.length-1].content)

        URL="https://www.rango.run/chat";

        const response = await fetch(URL, {
          credentials: "same-origin", // include, *same-origin, omit
          method: "POST",
          body: formData,
        });

        console.log("response = ", response);
        let responseJson = await response.json();
        console.log("responseJson = ", responseJson);
        responseJson.content = RESPONSE_PREFIX+responseJson.content;
        console.log("responseJson after adding prefix = ", responseJson);
        responseJson["preFilled"] = false
        return responseJson;
        setErr(false);
      } catch (err) {
        // console.log("error = ", err);
        setErr(err);
      }
    }
    return callAPI();
  };

  return (
    <div className="App">
        <header>
          <div className="menu">
            <button onClick={() => setShowMenu(true)}>
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#d9d9e3"
                strokeLinecap="round"
              >
                <path d="M21 18H3M21 12H3M21 6H3" />
              </svg>
            </button>
          </div>
          <h1>CharterAI</h1>
        </header>
        {showMenu && (
          <nav>
            <div className="navItems">
              <NewChat setChatLog={setChatLog} setShowMenu={setShowMenu} />
              {chatLog.map(
                (chat, idx) =>
                  chat.botMessage && (
                    <NavPrompt chatPrompt={chat.chatPrompt} key={idx} />
                  )
              )}
            </div>
            <div className="navCloseIcon">
              <svg
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                xmlSpace="preserve"
                stroke="#fff"
                width={42}
                height={42}
                onClick={() => setShowMenu(false)}
              >
                <path d="m53.691 50.609 13.467-13.467a2 2 0 1 0-2.828-2.828L50.863 47.781 37.398 34.314a2 2 0 1 0-2.828 2.828l13.465 13.467-14.293 14.293a2 2 0 1 0 2.828 2.828l14.293-14.293L65.156 67.73c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L53.691 50.609z" />
              </svg>
            </div>
          </nav>
        )}

        <Box className="sideBar">
          {/* <NewChat setChatLog={setChatLog} setShowMenu={setShowMenu} /> */}
          <div className="navPromptWrapper">
            <Link href="/">
                  <svg width="200.9227661132813" height="45.80471053644519" viewBox="0 0 370 86.01110346913065" class="css-1j8o68f"><defs id="SvgjsDefs3806"></defs><g id="SvgjsG3807" featurekey="4K7G0D-0" transform="matrix(0.3890405214529704,0,0,0.3890405214529704,-36.00612292412487,-40.2909113186358)" fill="#90cdf4"><title xmlns="http://www.w3.org/2000/svg">Artboard 1 copy 24</title><g xmlns="http://www.w3.org/2000/svg" data-name="Immersive experience "><path d="M348.75,193.09a23.63,23.63,0,0,0-35.7-13.93l-53.22-64.55a6.62,6.62,0,1,0-11.54-4.19l-101.46,18.9a14.2,14.2,0,1,0-20.94,15.83l.34.18-24.56,53a7.08,7.08,0,1,0-2,13.86,7.13,7.13,0,0,0,4.12-1.32l91.19,95.8a10.83,10.83,0,0,0,2.67,16.48,10.78,10.78,0,0,0,5.48,1.5,11,11,0,0,0,2.75-.35,10.85,10.85,0,0,0,5.84-17.14l97.63-91.3a23.76,23.76,0,0,0,4.58,3.53,23.51,23.51,0,0,0,11.95,3.27,23.81,23.81,0,0,0,6-.77,23.66,23.66,0,0,0,16.95-28.84Zm-19.46,19.17a13.57,13.57,0,0,1-10.35-1.44,13.76,13.76,0,0,1-2.34-1.74,13.77,13.77,0,0,1-4-6.6,13.79,13.79,0,0,1-.36-2.07,13,13,0,0,1,.82-6.23,13.81,13.81,0,0,1,1-2.06c.06-.1.13-.19.19-.29a13.79,13.79,0,0,1,1.22-1.67,13.48,13.48,0,0,1,4-3.19,13.58,13.58,0,0,1,6.39-1.59,13.66,13.66,0,0,1,3.41,26.88ZM207.78,312.63a4.81,4.81,0,0,1-.51,3.67h0a4.85,4.85,0,1,1-8.35-4.91c.06-.1.13-.18.2-.27a4.78,4.78,0,0,1,1.28-1.28l.17-.1a4.82,4.82,0,0,1,1.31-.58h0c.16,0,.31-.07.47-.09a4.88,4.88,0,0,1,.75-.07,5,5,0,0,1,2.45.67c.11.07.2.15.31.22a4.77,4.77,0,0,1,1.37,1.46A4.82,4.82,0,0,1,207.78,312.63Zm-7.42-9.28-.17.05-37.57-99,34.25-.93,4.71,99.59A11,11,0,0,0,200.36,303.36ZM100.91,208a3.08,3.08,0,1,1-1.28-5.88c.1,0,.2,0,.3,0l.28,0a3,3,0,0,1,1,.35,3,3,0,0,1,1.39,3.5l0,.08a3.07,3.07,0,0,1-.21.49s0,.1-.07.15A3.06,3.06,0,0,1,100.91,208Zm26.82-78.19a6.17,6.17,0,0,1,11.16,1c.07.18.15.35.2.54a6.23,6.23,0,0,1,.19,1.42c0,.06,0,.12,0,.18a6.13,6.13,0,0,1-.39,2.12,6.27,6.27,0,0,1-.47,1,6.2,6.2,0,0,1-7,2.83l-.14,0a6.23,6.23,0,0,1-1.34-.58l-.33-.22A6.21,6.21,0,0,1,127.73,129.76Zm17.6,10.34a14.27,14.27,0,0,0,1.32-3l43.12,11.18L150.3,172l-10.17-26.78A14.11,14.11,0,0,0,145.33,140.1Zm107.31-31.22a2.6,2.6,0,0,1,1.6-1.21,2.66,2.66,0,0,1,.66-.08,2.61,2.61,0,0,1,2.3,3.85l0,.1a2.59,2.59,0,0,1-1.28,1.09l-.29.11a2.61,2.61,0,0,1-1.34,0,3.5,3.5,0,0,1-.68-.27l-.19-.14a2.58,2.58,0,0,1-.67-.7l-.11-.18a2.62,2.62,0,0,1-.24-.58,2.66,2.66,0,0,1,0-.27,2.69,2.69,0,0,1,.32-1.71Zm-51.77,77.67a4.53,4.53,0,1,1-3.9-6.83h0a4.44,4.44,0,0,1,3.76,2.1,3.83,3.83,0,0,1,.68,1.88A4.49,4.49,0,0,1,200.87,186.55Zm3.18-7,17.35-23.08,21.26,5.51a11.9,11.9,0,0,0,.27,4.68l0,.07-38.36,13.76A8.53,8.53,0,0,0,204,179.52ZM251.77,116a6.58,6.58,0,0,0,2.07.7l-.28,35a11.91,11.91,0,0,0-9.37,5.84c-.06.1-.1.2-.16.3l-20.12-4.79Zm8.49,48.77a5.88,5.88,0,0,1-.69,1.83,6,6,0,0,1-.66.91,5.9,5.9,0,0,1-9.59-1,6,6,0,0,1-.77-3.06A6,6,0,0,1,253,157.9c.18,0,.36-.07.53-.1a5.92,5.92,0,0,1,1-.09,6.25,6.25,0,0,1,3,.82A5.93,5.93,0,0,1,260.26,164.8ZM250,114.65l-30.46,37.4-21.77-5.18,52.11-32.36Zm-33.08,40.62-17.06,21a8.51,8.51,0,0,0-11.38,8.82l-30.72,6.6-6.12-16.12,42.22-26.23ZM153,192.66l-44.3,9.51,38.48-23.9Zm.76,1.88L157,202.6l-46.64,1.26Zm4.68-1L188.89,187a8.44,8.44,0,0,0,7.47,5.74l.42,8.78-34.91.94Zm39.88-.88a8.49,8.49,0,0,0,6.91-10.32l38.37-13.76a11.89,11.89,0,0,0,20.7,1.69l.59.3,11.41,5.72,13.11,6.48,13.16,6.4,1.45.7a23.39,23.39,0,0,0-1.85,8.81l-103.42,2.79ZM309.3,182.16a23.75,23.75,0,0,0-3.84,4.89l-.1.18-1.43-.73-13.06-6.6-13.1-6.52-11.46-5.62-.57-.28a11.89,11.89,0,0,0-10.18-15.7l.28-35a6.67,6.67,0,0,0,2.27-.76Zm-60.64-69.77c0,.11.08.22.13.33L193.67,145.9l-46.51-11.08a14.08,14.08,0,0,0,0-3.53ZM128,146.18a13.76,13.76,0,0,0,6.55.85l11.19,27.7-41.58,25a7,7,0,0,0-.72-.53Zm-22.85,63.37a7.09,7.09,0,0,0,.55-.8h0a7,7,0,0,0,.92-2.78l51.19-1.38,40.27,99.64a10.73,10.73,0,0,0-1.75,1.12Zm105.1,96.2a11,11,0,0,0-1.71-1.24,10.79,10.79,0,0,0-5-1.49l-4.71-99.54,103.39-2.79A23.91,23.91,0,0,0,303,205a23.54,23.54,0,0,0,5,9.46Z"></path></g></g><g id="SvgjsG3808" featurekey="wPuqcM-0" transform="matrix(3.353903902997173,0,0,3.353903902997173,116.98148776671535,-0.4526464756220179)" fill="#90cdf4"><path d="M12.96 18.5 c-1.24 1.12 -2.9 1.7 -4.76 1.7 c-3.92 0 -7.3 -2.94 -7.3 -7.2 s3.38 -7.2 7.3 -7.2 c1.84 0 3.48 0.6 4.68 1.66 l-1.76 1.98 c-0.74 -0.52 -1.74 -0.9 -2.76 -0.9 c-2.52 0 -4.42 1.86 -4.42 4.46 s1.9 4.46 4.42 4.46 c1.06 0 2.1 -0.4 2.86 -1 z M20.88 9.44 c1.98 0 3.94 1.3 3.94 4.58 l0 5.98 l-2.86 0 l0 -5.78 c0 -1.7 -0.66 -2.28 -1.76 -2.28 c-1.52 0 -2.42 1.44 -2.64 2.16 l0 5.9 l-2.86 0 l0 -14.14 l2.86 0 l0 5.66 c0.2 -0.54 1.32 -2.08 3.32 -2.08 z M34.44 9.6 l2.86 0 l0 10.4 l-2.86 0 l0 -1.28 c-0.06 0.42 -1.08 1.48 -2.88 1.48 c-2.38 0 -5.14 -1.72 -5.14 -5.42 c0 -3.58 2.76 -5.36 5.14 -5.36 c1.8 0 2.82 1.12 2.88 1.34 l0 -1.16 z M31.96 17.66 c1.4 0 2.62 -0.96 2.62 -2.88 c0 -1.86 -1.22 -2.82 -2.62 -2.82 c-1.44 0 -2.76 0.98 -2.76 2.82 c0 1.9 1.32 2.88 2.76 2.88 z M45.84 9.44 c0.26 0 0.5 0 0.76 0.06 l0 2.74 c-0.24 -0.06 -0.48 -0.06 -0.68 -0.06 c-1.92 0 -3.5 1.38 -3.68 3.38 l0 4.44 l-2.86 0 l0 -10.4 l2.86 0 l0 2.6 c0.46 -1.58 1.72 -2.76 3.6 -2.76 z M53.18000000000001 17.6 c0.54 0 0.94 -0.06 1.38 -0.22 l0 2.4 c-0.44 0.2 -1.12 0.34 -2.12 0.34 c-1.62 0 -2.98 -0.56 -2.98 -3.5 l0 -4.66 l-1.46 0 l0 -2.36 l1.46 0 l0 -2.44 l2.86 0 l0 2.44 l2.22 0 l0 2.36 l-2.22 0 l0 4.64 c0 0.48 0.14 1 0.86 1 z M61.400000000000006 9.42 c2.36 0 5.62 1.78 5 6.38 l-7.56 0 c0.36 1.3 1.44 1.98 2.84 1.98 c1.3 0 1.8 -0.3 2.54 -0.7 l1.58 1.54 c-0.9 0.94 -2.18 1.58 -4.22 1.58 c-2.6 0 -5.64 -1.78 -5.64 -5.36 c0 -3.64 3.1 -5.42 5.46 -5.42 z M61.400000000000006 11.86 c-1.04 0 -2.14 0.64 -2.52 1.92 l5 0 c-0.32 -1.28 -1.46 -1.92 -2.48 -1.92 z M74.68 9.44 c0.26 0 0.5 0 0.76 0.06 l0 2.74 c-0.24 -0.06 -0.48 -0.06 -0.68 -0.06 c-1.92 0 -3.5 1.38 -3.68 3.38 l0 4.44 l-2.86 0 l0 -10.4 l2.86 0 l0 2.6 c0.46 -1.58 1.72 -2.76 3.6 -2.76 z"></path></g></svg>
            </Link>
            {chatLog.map(
              (chat, idx) =>
                chat.botMessage && (
                  <NavPrompt chatPrompt={chat.chatPrompt} key={idx} />
                )
            )}
          </div>
          
          {/* {system != "" && chatLog.length > 0 && (
            <NavLinks
              svg={
                <svg
                  fill="#fff"
                  viewBox="0 0 24 24"
                  data-name="Flat Line"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon flat-line"
                  stroke="#fff"
                  width={23}
                  height={23}
                >
                  <path
                    d="M5 8h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5V8Z"
                    transform="rotate(90 12 14)"
                    style={{
                      fill: "#fff202022",
                      strokeWidth: 2,
                    }}
                  />
                  <path
                    d="M16 7V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"
                    style={{
                      fill: "none",
                      stroke: "#fff202022000000",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                  <path
                    data-name="primary"
                    d="M10 11v6m4-6v6M4 7h16m-2 13V7H6v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1Z"
                    style={{
                      fill: "none",
                      stroke: "#fff202022000000",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                </svg>
              }
              text="Clear Conversations"
              setChatLog={setChatLog}
            />
          )} */}
          {/* <NavLinks
            svg={
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                stroke="#fff"
                width={25}
                height={25}
              >
                <title>{"discord_fill"}</title>
                <g stroke="none" fill="none" fillRule="evenodd">
                  <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
                  <path
                    d="M15.003 4c.744 0 1.53.26 2.25.547l.527.216c1.26.528 1.968 1.636 2.517 2.853.891 1.975 1.51 4.608 1.724 6.61.102.95.127 1.906-.056 2.549-.197.687-.867 1.173-1.518 1.555l-.322.183-.334.186c-.172.096-.349.191-.525.284l-.522.27-.717.357-.577.284a1 1 0 1 1-.894-1.788l.79-.39-.58-.609c-1.39.57-3.027.893-4.766.893-1.739 0-3.376-.322-4.766-.893l-.58.608.793.39a1 1 0 1 1-.894 1.79l-.544-.27c-.402-.2-.805-.398-1.203-.607l-.928-.505-.321-.183c-.651-.382-1.322-.868-1.518-1.555-.184-.643-.158-1.598-.057-2.55.214-2.001.833-4.634 1.724-6.609.549-1.217 1.257-2.325 2.517-2.853C7.059 4.413 8.072 4 9 4c.603 0 1.077.555.99 1.147A13.65 13.65 0 0 1 12 5c.691 0 1.366.05 2.014.148A1.012 1.012 0 0 1 15.004 4ZM8.75 10.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm6.5 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            }
            text="CharterAI Discord"
            link="https://discord.com/invite/openai"
          /> */}
          {/* <NavLinks
            svg={
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={25}
                height={25}
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5m-6 0 7.5-7.5M15 3h6v6"
                />
              </svg>
            }
            text="Updates & FAQ"
            link="https://help.openai.com/en/collections/3742473-chatgpt"
          /> */}
        </Box>

        <section className="chatBox">
          {system == "" ? <Box mt={20} mb={20}> <StatsCard/> </Box> : null}
          <Box className="selectBox" mt={1} mb={5}>
          <FormControl >
          <FormLabel as='legend'>Selected System Prompt</FormLabel>
            <Select onChange={(x)=>{console.log('x.target.value=', x.target.value); setSystem(x.target.value);}}>
              <option  value="">Select a prompt to continue</option>
              {Object.keys(chatPayloads).map((key) => {
                  if (key != "") {
                    return  <option value={key}>{chatPayloads[key]["longName"]}</option>
                  }
                })}
            </Select>
           </FormControl>
          </Box>
          {system == "" ? <Box mt={20} mb={20}> </Box> : null}
          {system != "" &&  chatLog.length > 0 ? 
            chatLog.map((chat, idx) => 
            {
              let content = chat.content;
              let snippet = ""
              if (idx != 0) {
                if (content.includes('<internal>') && content.includes('</internal>')) {
                  content = content.split('</internal>\n')[1].replace('<result>\n', '').replace('</result>', '');
                  snippet = chat.content.split('<internal>\n')[1].split('</internal>')[0];
                }
              }
              // console.log('content=', content);
              // console.log('snippet=', snippet);
            return (
              <div className="chatLog" key={idx} >{
              chat.role == 'user' ?
                (
                    <div className="chatPromptMainContainer">
                      <div className="chatPromptWrapper">
                        <Avatar bg="#5437DB" className="userSVG">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth={1.9}
                            viewBox="0 0 24 24"
                            // strokeLinecap="round"
                            // strokeLinejoin="round"
                            className="h-6 w-6"
                            height={40}
                            width={40}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx={12} cy={7} r={4} />
                          </svg>
                        </Avatar>
                        <div id="botMessage">
                          <div id="chatPrompt"><pre>{chat.content}</pre></div>
                        </div>
                      </div>
                    </div>
                ) : 
                (
                    <div className="botMessageMainContainer">
                    <div className="botMessageWrapper">
                      <Avatar bg="#212121" className="openaiSVG">
                        <svg
                          width={100}
                          height={100}
                          // fill="none"
                          // xmlns="http://www.w3.org/2000/svg"
                          strokeWidth={1.5}
                          className="h-6 w-6"
                        >
                          <g id="SvgjsG3807" featurekey="4K7G0D-0" transform="matrix(.25,0,0,.25,-4,0.1)" fill="#90cdf4"><title xmlns="http://www.w3.org/2000/svg">Artboard 1 copy 24</title>
                            <g xmlns="http://www.w3.org/2000/svg" data-name="Immersive experience ">
                              <path d="M348.75,193.09a23.63,23.63,0,0,0-35.7-13.93l-53.22-64.55a6.62,6.62,0,1,0-11.54-4.19l-101.46,18.9a14.2,14.2,0,1,0-20.94,15.83l.34.18-24.56,53a7.08,7.08,0,1,0-2,13.86,7.13,7.13,0,0,0,4.12-1.32l91.19,95.8a10.83,10.83,0,0,0,2.67,16.48,10.78,10.78,0,0,0,5.48,1.5,11,11,0,0,0,2.75-.35,10.85,10.85,0,0,0,5.84-17.14l97.63-91.3a23.76,23.76,0,0,0,4.58,3.53,23.51,23.51,0,0,0,11.95,3.27,23.81,23.81,0,0,0,6-.77,23.66,23.66,0,0,0,16.95-28.84Zm-19.46,19.17a13.57,13.57,0,0,1-10.35-1.44,13.76,13.76,0,0,1-2.34-1.74,13.77,13.77,0,0,1-4-6.6,13.79,13.79,0,0,1-.36-2.07,13,13,0,0,1,.82-6.23,13.81,13.81,0,0,1,1-2.06c.06-.1.13-.19.19-.29a13.79,13.79,0,0,1,1.22-1.67,13.48,13.48,0,0,1,4-3.19,13.58,13.58,0,0,1,6.39-1.59,13.66,13.66,0,0,1,3.41,26.88ZM207.78,312.63a4.81,4.81,0,0,1-.51,3.67h0a4.85,4.85,0,1,1-8.35-4.91c.06-.1.13-.18.2-.27a4.78,4.78,0,0,1,1.28-1.28l.17-.1a4.82,4.82,0,0,1,1.31-.58h0c.16,0,.31-.07.47-.09a4.88,4.88,0,0,1,.75-.07,5,5,0,0,1,2.45.67c.11.07.2.15.31.22a4.77,4.77,0,0,1,1.37,1.46A4.82,4.82,0,0,1,207.78,312.63Zm-7.42-9.28-.17.05-37.57-99,34.25-.93,4.71,99.59A11,11,0,0,0,200.36,303.36ZM100.91,208a3.08,3.08,0,1,1-1.28-5.88c.1,0,.2,0,.3,0l.28,0a3,3,0,0,1,1,.35,3,3,0,0,1,1.39,3.5l0,.08a3.07,3.07,0,0,1-.21.49s0,.1-.07.15A3.06,3.06,0,0,1,100.91,208Zm26.82-78.19a6.17,6.17,0,0,1,11.16,1c.07.18.15.35.2.54a6.23,6.23,0,0,1,.19,1.42c0,.06,0,.12,0,.18a6.13,6.13,0,0,1-.39,2.12,6.27,6.27,0,0,1-.47,1,6.2,6.2,0,0,1-7,2.83l-.14,0a6.23,6.23,0,0,1-1.34-.58l-.33-.22A6.21,6.21,0,0,1,127.73,129.76Zm17.6,10.34a14.27,14.27,0,0,0,1.32-3l43.12,11.18L150.3,172l-10.17-26.78A14.11,14.11,0,0,0,145.33,140.1Zm107.31-31.22a2.6,2.6,0,0,1,1.6-1.21,2.66,2.66,0,0,1,.66-.08,2.61,2.61,0,0,1,2.3,3.85l0,.1a2.59,2.59,0,0,1-1.28,1.09l-.29.11a2.61,2.61,0,0,1-1.34,0,3.5,3.5,0,0,1-.68-.27l-.19-.14a2.58,2.58,0,0,1-.67-.7l-.11-.18a2.62,2.62,0,0,1-.24-.58,2.66,2.66,0,0,1,0-.27,2.69,2.69,0,0,1,.32-1.71Zm-51.77,77.67a4.53,4.53,0,1,1-3.9-6.83h0a4.44,4.44,0,0,1,3.76,2.1,3.83,3.83,0,0,1,.68,1.88A4.49,4.49,0,0,1,200.87,186.55Zm3.18-7,17.35-23.08,21.26,5.51a11.9,11.9,0,0,0,.27,4.68l0,.07-38.36,13.76A8.53,8.53,0,0,0,204,179.52ZM251.77,116a6.58,6.58,0,0,0,2.07.7l-.28,35a11.91,11.91,0,0,0-9.37,5.84c-.06.1-.1.2-.16.3l-20.12-4.79Zm8.49,48.77a5.88,5.88,0,0,1-.69,1.83,6,6,0,0,1-.66.91,5.9,5.9,0,0,1-9.59-1,6,6,0,0,1-.77-3.06A6,6,0,0,1,253,157.9c.18,0,.36-.07.53-.1a5.92,5.92,0,0,1,1-.09,6.25,6.25,0,0,1,3,.82A5.93,5.93,0,0,1,260.26,164.8ZM250,114.65l-30.46,37.4-21.77-5.18,52.11-32.36Zm-33.08,40.62-17.06,21a8.51,8.51,0,0,0-11.38,8.82l-30.72,6.6-6.12-16.12,42.22-26.23ZM153,192.66l-44.3,9.51,38.48-23.9Zm.76,1.88L157,202.6l-46.64,1.26Zm4.68-1L188.89,187a8.44,8.44,0,0,0,7.47,5.74l.42,8.78-34.91.94Zm39.88-.88a8.49,8.49,0,0,0,6.91-10.32l38.37-13.76a11.89,11.89,0,0,0,20.7,1.69l.59.3,11.41,5.72,13.11,6.48,13.16,6.4,1.45.7a23.39,23.39,0,0,0-1.85,8.81l-103.42,2.79ZM309.3,182.16a23.75,23.75,0,0,0-3.84,4.89l-.1.18-1.43-.73-13.06-6.6-13.1-6.52-11.46-5.62-.57-.28a11.89,11.89,0,0,0-10.18-15.7l.28-35a6.67,6.67,0,0,0,2.27-.76Zm-60.64-69.77c0,.11.08.22.13.33L193.67,145.9l-46.51-11.08a14.08,14.08,0,0,0,0-3.53ZM128,146.18a13.76,13.76,0,0,0,6.55.85l11.19,27.7-41.58,25a7,7,0,0,0-.72-.53Zm-22.85,63.37a7.09,7.09,0,0,0,.55-.8h0a7,7,0,0,0,.92-2.78l51.19-1.38,40.27,99.64a10.73,10.73,0,0,0-1.75,1.12Zm105.1,96.2a11,11,0,0,0-1.71-1.24,10.79,10.79,0,0,0-5-1.49l-4.71-99.54,103.39-2.79A23.91,23.91,0,0,0,303,205a23.54,23.54,0,0,0,5,9.46Z">
                              </path>
                            </g>
                          </g>
                        {/* <g id="SvgjsG3807" featurekey="4K7G0D-0" transform="matrix(0.3890405214529704,0,0,0.3890405214529704,-36.00612292412487,-40.2909113186358)" fill="#90cdf4"><title xmlns="http://www.w3.org/2000/svg">Artboard 1 copy 24</title><g xmlns="http://www.w3.org/2000/svg" data-name="Immersive experience "> */}
                          {/* <path
                            d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
                            fill="currentColor"
                          /> */}
                        </svg> 
                      </Avatar>
                      {chat.content ? (
                        <div id="botMessage">
                          {snippet == "" ? null : <CodeSnippet text={snippet}/>}
                          {chat.preFilled? <pre id="chatPrompt">{idx==0? chat.content : content}</pre> : <BotResponse response={content} scroller={scrollToBottom} />}
                          {/* <div id="chatPrompt">{chat.content}</div> */}
                          {/* <div id="chatPrompt"><BotResponse response={chat.content} /></div> */}
                          </div>
                      ) : err ? (
                        <Error err={err} />
                      ) : (
                        <Loading />
                      )}
                    </div>
                  </div>
                )}
                </div>
              )
            }
            ) : (
            null
          )
          
          }
          <div ref={messagesEndRef}> {""} </div>
          {/* <form onSubmit={handleSubmit}> */}
        </section>
        <div className="inputPromptWrapper">
          <form onSubmit={async (e) => {
              // console.log('submitting with inputPrompt = ', inputPrompt);
              let newChatLog = [...chatLog, { role: "user", content: inputPrompt, preFilled: false}, {role: "assistant", content: "...", preFilled: false }]
              // console.log('newChatLog = ', newChatLog);
              setChatLog(newChatLog);
              setInputPrompt(" ");
              let responseJson = await handleSubmit(e, newChatLog);
              setInputPrompt("");
              if (responseJson){
                // newChatLog.push(responseJson);
                newChatLog[newChatLog.length-1] = responseJson;
                // console.log("newChatLog after call = ", newChatLog);
                setChatLog(newChatLog);
                const delay = ms => new Promise(res => setTimeout(res, ms));
                // delay 50ms to give screen time to scroll....
                await delay(50);
                // console.log("last scroll....");
                scrollToBottom();
              }              
            }}            
            >
            {/* <div className="inputPromptWrapper"> */}
              <input
                // name="inputPrompt"
                id=""
                className="inputPrompttTextarea"
                type="text"
                rows="1"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                autoFocus
                disabled={system==""}
              ></input>
              <p></p>
          </form>
        </div>
      </div>


  );
}

export default App;

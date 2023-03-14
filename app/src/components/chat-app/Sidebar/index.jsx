import { AccountContext } from "../../../contexts/account";
import { ChatsContext } from "../../../contexts/chats";
import { getDefaultChatState, getNewChatId } from "../../../utils";
import DiscordIcon from "../../assets/DiscordIcon";
import FullLogo from "../../assets/FullLogo";

import {
  Avatar,
  Box,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NavLinks from "./NavLink";
import { FaCopy, FaDiscourse } from "react-icons/fa";
import { useContext } from "react";
import { FaPlusCircle, FaArrowRight, FaTrashAlt } from "react-icons/fa";

const Sidebar = ({ chatState, setChatState }) => {
  const { credentials, setCredentials } = useContext(AccountContext);
  const { chatHistory, setChatHistory } = useContext(ChatsContext);
  const { chatId, primaryChatId } = chatState;
  let email = credentials?.email?.length > 10 ? credentials?.email : "";

  return (
    <Box className="sideBar">
      <Box ml={2}>
        <div className="navPromptWrapper">
          <Link href="/">
            <FullLogo />
          </Link>
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="blue"
              width={"100%"}
              mt={3}
              variant="outline"
              fontSize={"sm"}
              leftIcon={
                <Avatar
                  name={credentials.name}
                  src={credentials.picture}
                  size={"sm"}
                />
              }
            >
              {email.length > 15 ? email.slice(0, 15) + "..." : email}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={async () => {
                  setCredentials({});
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>

          <Button
            mt={4}
            ml={-2}
            width={"100%"}
            variant="text"
            onClick={() => {
              setChatState(getDefaultChatState());
            }}
          >
            <NavLinks svg={<FaPlusCircle />} text="New Chat" />
          </Button>
          {Object.keys(chatHistory)
            .sort(function (a, b) {
              return chatHistory[a].chatNumber - chatHistory[b].chatNumber;
            })
            .filter((ele) => {
              return !ele.includes("system");
            })
            .map((convId, it) => {
              return (
                <Button
                  variant={primaryChatId == convId ? null : "text"}
                  width={"90%"}
                  onClick={() => {
                    setChatState(chatHistory[convId]);
                  }}
                >
                  <NavLinks
                    svg={<FaArrowRight />}
                    text={"Conversation " + it}
                  />
                </Button>
              );
            })}
          <Button
            mt={1}
            ml={-2}
            width={"100%"}
            onClick={() => {
              setChatHistory({});
              setChatState(getDefaultChatState());
            }}
            variant="text"
          >
            <NavLinks svg={<FaTrashAlt />} text="Clear Chat" />
          </Button>
        </div>
      </Box>

      <Box ml={4}>
        <NavLinks
          svg={<DiscordIcon />}
          text="Charter Discord"
          link="https://discord.gg/D4pB3ydEeh"
        />
      </Box>

      <Box ml={5}>
        <NavLinks
          svg={<FaDiscourse />}
          text="Charter Discorse"
          link="https://gov.charterai.org"
          textRight={1}
        />
      </Box>
      <Box ml={5}>
        <NavLinks
          svg={<FaCopy />}
          text="Copy Conversation"
          chatLog={chatState?.chatLog}
          system={chatState?.system}
          textRight={1}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;

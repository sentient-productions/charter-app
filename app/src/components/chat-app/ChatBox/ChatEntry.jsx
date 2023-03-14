import BotResponse from "./BotResponse";
import CodeSnippet from "./CodeSnippet";
import Editable from "./Editable";
import Error from "./Error";
import Loading from "./Loading";
import { AccountContext } from "../../../contexts/account";
import {
  Avatar,
  Box,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useRef } from "react";
import html2canvas from "html2canvas";
import { FaShareAltSquare } from "react-icons/fa";
// import { RWebShare } from "react-web-share";
import { Dropbox } from "dropbox";

// Set the refresh token and app key and secret
const REFRESH_TOKEN =
  "4YvtvjPGMLwAAAAAAAAAAdurzzuml0tXP8qyHG3b5q5hZROED3CHCB06-euUG44v";
const APP_KEY = "7unr40kt1u6ulvn";
const APP_SECRET = "gbhqnb0uzq7x34s";

// Generate a new access token using the refresh token
const getAccessToken = async () => {
  const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
      client_id: APP_KEY,
      client_secret: APP_SECRET,
    }),
  });
  const data = await response.json();
  return data.access_token;
};

// Upload a file to Dropbox
const uploadFile = async (accessToken, fileName, fileContent) => {
  // Initialize the Dropbox client
  console.log("making dbx client");
  const dbx = new Dropbox({ accessToken });
  console.log("uploading..");

  // Upload the file to Dropbox
  try {
    const response = await dbx.filesUpload({
      path: "/" + fileName,
      contents: fileContent,
      mode: { ".tag": "add" },
    });
    console.log("File uploaded to Dropbox:", response.path_display);
  } catch (error) {
    console.error("Error uploading file to Dropbox:", error);
  }
};

const ChatEntry = ({
  chat,
  chatState,
  err,
  content,
  diagnostic,
  idx,
  scrollToBottom,
  setChatState,
}) => {
  const componentRef = useRef(null);
  const { credentials } = useContext(AccountContext);

  const captureComponent = () => {
    console.log("converting image now...");
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // const img = new Image();
      // img.src = imgData;
      // document.body.appendChild(img);
      const link = document.createElement("a");
      link.download = "my-image.png";
      link.href = imgData;
      link.click();
    });
  };

  return (
    <div ref={componentRef}>
      {" "}
      {chat.role == "user" ? (
        <Container maxWidth={"900px"} pl={2.5} pt={4} pb={2}>
          <HStack width={"100%"} alignItems="flex-start">
            <Box>
              <Avatar
                name={credentials.name}
                src={credentials.picture}
                size={"sm"}
              />
            </Box>
            <Box pl={2} flexGrow={1} textAlign={"left"}>
              <div id="botMessage">
                <div id="chatPrompt">
                  <Editable
                    chatState={chatState}
                    setChatState={setChatState}
                    defaultVal={chat.content}
                    idx={idx}
                  />
                </div>
              </div>
            </Box>
          </HStack>
        </Container>
      ) : (
        <div className="botMessageMainContainer" key={idx}>
          {/* <div className="botMessageWrapper"> */}
          <Container maxWidth={"900px"} pl={2.5} pt={4} pb={2}>
            <HStack width={"100%"} alignItems="flex-start">
              <Box>
                <Avatar
                  name={credentials.name}
                  src={"/favicon.png"}
                  size={"sm"}
                />
              </Box>
              <Box pl={2} flexGrow={1} textAlign={"left"}>
                {chat.content ? (
                  <div id="botMessage">
                    {diagnostic == "" ? null : (
                      <CodeSnippet text={diagnostic} />
                    )}
                    {chat.preFilled ? (
                      <pre id="chatPrompt">
                        {idx == 0 ? (
                          <Editable
                            chatState={chatState}
                            setChatState={setChatState}
                            defaultVal={chat.content}
                            idx={idx}
                          />
                        ) : (
                          <BotResponse
                            response={content}
                            scrollToBottom={scrollToBottom}
                            preFilled={chat.preFilled}
                          />
                        )}
                      </pre>
                    ) : (
                      <BotResponse
                        response={content}
                        scrollToBottom={scrollToBottom}
                      />
                    )}
                  </div>
                ) : err ? (
                  <Error err={err} />
                ) : (
                  <Loading />
                )}
                {/* <Box
              width={0}
              height={50}
              alignContent="right"
              justifyContent={"right"}
              alignItems={"right"}
            >
              <IconButton
                icon={
                  <FaShareAltSquare
                    onClick={() => {
                      html2canvas(componentRef.current).then(async (canvas) => {
                        console.log("fetching access token...");
                        const accessToken = await getAccessToken();
                        console.log("accessToken = ", accessToken);
                        var dataURL = canvas.toDataURL();
                        // console.log("dataURL=", dataURL);
                        // // Remove the "data:image/png;base64," prefix from the data URL
                        var fileData = dataURL.replace(
                          /^data:image\/(png|jpg);base64,/,
                          ""
                        );
                        uploadFile(accessToken, "test123", fileData);
                        // const dbx = new Dropbox({
                        //   accessToken:
                        //     "sl.BaQ_OIknRy1ef_Ato4yy0vlPhDp-U0NYPZ88GlU0KmJkjP0_baSc7xW3NN7zi9RlS-rvudKyCnh4A5s99UwuDgV4qjyLXPFJbcaKXMY8qaQxhnH7Gf4xMAlfqsa0RDW_mqckp9Y_",
                        // });

                        // dbx
                        //   .filesUpload({
                        //     path: "/remote/path/to/file",
                        //     contents: fileData,
                        //   })
                        //   .then((response) => {
                        //     console.log("File uploaded successfully!");
                        //     console.log(response);
                        //   })
                        //   .catch((error) => {
                        //     console.error(`Error uploading file: ${error}`);
                        //   });
                      });
                    }}
                  />
                }
              />
            </Box> */}
                {/* <button onClick={captureComponent}>Share</button> */}
                {/* </div> */}
              </Box>
            </HStack>
          </Container>
        </div>
      )}
    </div>
  );
};
export default ChatEntry;

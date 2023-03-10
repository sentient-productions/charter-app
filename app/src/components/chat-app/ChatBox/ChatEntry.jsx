import Avatar from "./Avatar";
import BotResponse from "./BotResponse";
import CodeSnippet from "./CodeSnippet";
import Editable from "./Editable";
import Error from "./Error";
import Loading from "./Loading";
import { Box, ButtonGroup, Container, IconButton } from "@chakra-ui/react";
import { useRef } from "react";
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
  system,
  chatLog,
  chatLogVec,
  err,
  content,
  diagnostic,
  idx,
  scrollToBottom,
  setChatLogVec,
  selectedChatId,
  setSelectedChatId,
}) => {
  const componentRef = useRef(null);

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
        <Container maxWidth={"900px"} pl={5} pt={4} pb={6}>
          <Box height={0} width={0}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={1.9}
              viewBox="0 0 24 24"
              className="h-6 w-6"
              height={40}
              width={40}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx={12} cy={7} r={4} />
            </svg>
          </Box>
          <Box pl={16}>
            <div id="botMessage">
              <div id="chatPrompt">
                <Editable
                  system={system}
                  chatLog={chatLog}
                  chatLogVec={chatLogVec}
                  selectedChatId={selectedChatId}
                  setChatLogVec={setChatLogVec}
                  setSelectedChatId={setSelectedChatId}
                  defaultVal={chat.content}
                  idx={idx}
                />
              </div>
            </div>
          </Box>
        </Container>
      ) : (
        <div className="botMessageMainContainer" key={idx}>
          <div className="botMessageWrapper">
            <Avatar bg="none" className="openaiSVG">
              <svg
                width={100}
                height={100}
                strokeWidth={1.5}
                className="h-6 w-6"
              >
                <g
                  id="SvgjsG1187"
                  featurekey="4K7G0D-0"
                  transform="matrix(0.1644132055021425,0,0,0.1644132055021425,-2.9143219713545885,-5.2593024442759395)"
                  fill="#90cdf4"
                >
                  <g
                    xmlns="http://www.w3.org/2000/svg"
                    transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)"
                    fill="#90cdf4"
                    stroke="none"
                  >
                    <path d="M2983 5664 c-145 -21 -253 -50 -354 -95 -52 -23 -101 -41 -109 -41 -8 0 -49 8 -90 17 -109 25 -328 16 -467 -19 -189 -47 -375 -133 -559 -257 -457 -308 -820 -859 -875 -1330 -12 -103 -12 -104 -56 -149 -266 -269 -364 -809 -247 -1355 89 -417 370 -890 653 -1098 93 -68 99 -74 110 -122 6 -27 31 -91 56 -141 139 -287 454 -553 840 -709 464 -187 1056 -204 1443 -40 l109 45 69 -17 c105 -26 310 -24 443 6 410 90 815 361 1096 736 142 188 209 306 288 505 56 140 84 246 95 365 9 89 10 90 57 139 133 137 230 356 275 621 20 114 22 154 17 325 -7 284 -43 463 -142 716 -133 341 -338 630 -571 805 -60 45 -94 77 -94 89 0 33 -46 146 -91 226 -193 338 -651 640 -1126 744 -228 50 -563 65 -770 34z m405 -25 c411 -45 835 -240 1103 -508 114 -114 227 -274 253 -358 l7 -21 -63 20 c-80 26 -265 35 -379 18 -237 -34 -482 -151 -672 -320 -72 -65 -167 -208 -208 -314 -55 -141 -72 -249 -66 -416 3 -80 9 -156 13 -169 l7 -24 -184 6 c-173 5 -401 35 -421 55 -4 4 10 41 31 82 178 341 274 771 242 1081 -26 246 -112 433 -190 414 -53 -13 -83 -39 -102 -88 l-19 -48 34 -62 c81 -145 122 -344 112 -542 -12 -239 -82 -530 -178 -737 -31 -67 -33 -70 -62 -64 -42 9 -177 68 -244 108 -72 43 -193 156 -247 233 -100 140 -150 282 -165 461 -19 248 36 504 154 705 46 77 126 174 175 208 27 20 28 20 127 -6 72 -18 117 -24 166 -21 37 2 70 6 73 9 6 7 -25 46 -96 120 l-46 49 73 30 c114 47 256 79 459 103 67 8 222 6 313 -4z m-1126 -245 l38 -7 -74 -78 c-56 -60 -87 -105 -129 -186 -103 -203 -143 -384 -133 -608 8 -189 28 -281 86 -400 101 -205 250 -350 472 -458 70 -34 127 -66 128 -72 1 -50 -332 -509 -352 -485 -2 3 -31 45 -63 94 -207 315 -478 567 -763 710 -205 103 -447 142 -482 77 -5 -10 -12 -37 -16 -60 -6 -37 -3 -45 29 -84 l36 -44 103 -6 c282 -17 542 -159 838 -457 74 -75 162 -174 195 -219 l59 -84 -44 -39 c-130 -114 -285 -192 -439 -224 -112 -22 -304 -15 -409 15 -338 98 -665 405 -761 715 -32 105 -31 110 57 206 47 52 87 107 101 139 25 58 23 68 -7 52 -12 -6 -38 -11 -60 -11 -22 0 -59 -7 -82 -15 -23 -8 -43 -15 -44 -15 -1 0 1 30 5 68 21 195 130 475 261 672 264 395 736 717 1150 785 157 25 233 30 300 19z m2433 -655 l70 -24 33 -109 c20 -68 45 -126 65 -154 36 -51 57 -63 57 -35 0 11 10 39 21 63 12 24 24 61 27 82 2 21 8 38 12 38 14 0 136 -99 186 -151 248 -261 399 -549 469 -894 81 -406 50 -747 -98 -1068 -34 -74 -94 -167 -107 -167 -3 0 -12 28 -19 61 -38 185 -214 425 -417 571 -86 61 -237 140 -354 184 -72 27 -82 28 -250 28 -162 0 -182 -2 -265 -28 -116 -35 -253 -103 -344 -172 -40 -30 -76 -54 -80 -54 -11 0 -96 147 -141 243 -42 91 -115 295 -109 301 2 3 65 9 139 15 314 26 546 86 790 204 198 96 367 230 455 360 49 72 48 115 -2 157 -34 28 -43 31 -86 25 -67 -8 -68 -9 -112 -82 -22 -37 -76 -103 -120 -148 -170 -173 -415 -295 -760 -380 -93 -23 -324 -58 -333 -50 -12 10 -32 178 -32 265 0 241 82 441 250 611 161 163 355 265 608 320 127 28 349 22 447 -12z m-4146 -1242 c60 -231 282 -491 544 -636 208 -115 382 -154 580 -131 176 20 364 95 503 201 34 25 66 49 72 53 13 8 88 -112 143 -229 40 -86 119 -296 119 -315 0 -6 -28 -10 -63 -10 -95 0 -307 -27 -435 -56 -330 -74 -627 -226 -804 -413 -136 -143 -154 -205 -77 -261 34 -24 43 -26 81 -19 24 4 48 8 54 9 6 0 32 34 59 76 140 222 402 391 765 494 134 38 275 66 371 75 l76 7 14 -68 c20 -101 18 -332 -5 -414 -23 -84 -72 -190 -128 -277 -134 -206 -405 -374 -708 -439 -122 -26 -318 -24 -425 5 -43 12 -83 25 -87 29 -4 4 -22 54 -39 112 -31 104 -59 159 -98 194 -21 19 -21 19 -21 -5 0 -14 -5 -30 -11 -36 -6 -6 -20 -43 -32 -82 l-22 -71 -80 64 c-115 92 -256 256 -345 401 -112 182 -192 393 -237 623 -24 122 -27 161 -27 357 -1 194 2 234 23 335 24 121 73 265 124 365 30 61 88 148 94 142 1 -2 12 -38 22 -80z m2411 14 c105 -22 219 -37 351 -46 l86 -7 26 -97 c34 -130 88 -272 154 -408 l55 -111 -43 -39 c-71 -64 -227 -252 -302 -363 -43 -65 -76 -105 -86 -104 -9 1 -61 13 -116 27 -135 35 -267 56 -406 64 l-117 6 -22 86 c-33 127 -95 291 -158 418 l-55 112 91 96 c103 108 208 239 277 349 l47 74 61 -19 c34 -10 105 -28 157 -38z m1639 -392 c99 -25 279 -114 377 -187 144 -107 280 -265 352 -409 31 -61 72 -190 72 -226 0 -11 -33 -54 -74 -96 -66 -67 -126 -158 -126 -190 0 -13 51 -7 144 15 32 8 61 12 64 9 13 -13 -22 -188 -62 -309 -88 -266 -213 -473 -410 -674 -342 -351 -766 -552 -1157 -552 -116 0 -132 8 -89 43 128 108 251 353 291 577 18 105 16 334 -5 449 -38 216 -170 422 -359 562 -74 55 -214 132 -285 157 l-33 11 16 32 c65 124 191 305 297 423 l43 48 61 -93 c272 -416 672 -732 1022 -809 134 -30 209 -24 230 17 5 10 12 37 15 60 5 38 1 47 -31 83 -37 41 -37 41 -122 46 -197 10 -399 89 -593 230 -92 66 -236 196 -317 285 -83 91 -189 228 -190 245 0 11 96 91 173 143 95 64 227 114 349 131 88 12 256 2 347 -21z m-1681 -784 c105 -13 262 -41 268 -48 1 -1 -25 -56 -57 -122 -69 -141 -138 -325 -168 -445 -75 -306 -79 -613 -11 -820 59 -175 104 -216 194 -174 27 13 38 28 54 69 l19 53 -33 58 c-147 259 -151 628 -13 1079 28 89 92 247 109 268 8 9 128 -31 200 -68 187 -95 319 -233 410 -429 64 -138 75 -196 75 -406 0 -169 -3 -195 -28 -294 -50 -200 -136 -362 -251 -475 l-65 -65 -120 28 c-91 22 -131 27 -170 21 -28 -4 -53 -10 -56 -15 -5 -8 39 -63 99 -123 21 -21 37 -40 35 -42 -17 -15 -141 -59 -237 -84 -174 -43 -287 -55 -490 -48 -205 6 -308 25 -511 93 -382 127 -686 344 -878 629 -45 66 -89 152 -82 159 2 3 36 -5 74 -16 57 -17 96 -21 210 -21 255 1 449 63 674 214 173 115 279 239 352 409 64 152 93 370 70 533 -6 44 -9 83 -5 88 8 14 196 11 332 -6z"></path>
                  </g>
                </g>
              </svg>
            </Avatar>
            {chat.content ? (
              <div id="botMessage">
                {diagnostic == "" ? null : <CodeSnippet text={diagnostic} />}
                {chat.preFilled ? (
                  <pre id="chatPrompt">
                    {idx == 0 ? (
                      <Editable
                        system={system}
                        chatLog={chatLog}
                        chatLogVec={chatLogVec}
                        selectedChatId={selectedChatId}
                        setChatLogVec={setChatLogVec}
                        setSelectedChatId={setSelectedChatId}
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
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatEntry;

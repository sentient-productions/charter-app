import React from "react";
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Container,
  Center,
} from "@chakra-ui/react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useContext } from "react";
import { AccountContext } from "../../contexts/account";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function App() {
  const { credentials, setCredentials } = useContext(AccountContext);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setCredentials({ accessToken: tokenResponse.access_token });
      navigate("/chat");
    },
  });

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
      const responsePayload = JSON.parse(
        atob(credentialResponse.credential)[1]
      );
      console.log("responsePayload = ", responsePayload);
      setCredentials(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      //
    >
      <Stack spacing={8} mx={"auto"} width={"400px"} py={12} px={6}>
        {/* <Stack align={"center"} justifyContent="center" alignItems={"center"}> */}
        <Center>
          <Heading fontSize={"4xl"}>Sign in</Heading>
        </Center>
        {/* </Stack> */}

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {/* <GoogleLogin
              clientId={clientId}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              //   style={{ marginTop: "100px" }}
              //   isSignedIn={true}
              width={"350px"}
            /> */}
            {/* <Button
              onClick={async () => {
                login();
              }}
            >
              {" "}
              Login{" "}
            </Button> */}
            {/* <Container alignItems={"center"} justifyContent={"center"} ml={3}>
              <GoogleButton
                onClick={() => {
                  login();
                }}
              />
            </Container> */}

            {
              <Button
                leftIcon={<FaGoogle />}
                onClick={async () => {
                  login();
                }}
                colorScheme={"blue"}
              >
                {" "}
                Continue With Google{" "}
              </Button>
            }

            {/* <Button
              onClick={async () => {
                googleLogout();
                setCredentials({});
              }}
              width={"250px"}
            >
              {" "}
              Logout{" "}
            </Button> */}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default App;
// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Checkbox,
//   Stack,
//   Link,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { GoogleLogin } from "@react-oauth/google";
// import { googleLogout } from "@react-oauth/google";
// import { useGoogleOneTapLogin } from "@react-oauth/google";
// import { useContext } from "react";
// import { AccountContext } from "../../contexts/account";

// const Login = () => {
//   const { credentials, setCredentials } = useContext(AccountContext);

//   console.log("credentials=", credentials);
//   useGoogleOneTapLogin({
//     onSuccess: (credentialResponse) => {
//       console.log(credentialResponse);
//       const responsePayload = JSON.parse(
//         atob(credentialResponse.credential)[1]
//       );
//       console.log("responsePayload = ", responsePayload);
//       setCredentials(credentialResponse);
//     },
//     onError: () => {
//       console.log("Login Failed");
//     },
//   });

//   const onSuccess = (credentialResponse) => {
//     console.log("success....");
//     // const responsePayload = JSON.parse(atob(credentialResponse.credential)[1]);
//     // console.log("responsePayload = ", responsePayload);
//     console.log("success login, response=", credentialResponse);
//     setCredentials(credentialResponse);
//     // window.location.reload();
//   };

//   const onFailure = (response) => {
//     console.log("fail login, response =", response);
//   };

//   const clientId =
//     "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com";
//   return (
//     <Flex
//       minH={"100vh"}
//       align={"center"}
//       justify={"center"}
//       bg={useColorModeValue("gray.50", "gray.800")}
//     >
//       <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
//         <Stack align={"center"}>
//           <Heading fontSize={"4xl"}>Sign in to your account</Heading>
//         </Stack>

//         <Box
//           rounded={"lg"}
//           bg={useColorModeValue("white", "gray.700")}
//           boxShadow={"lg"}
//           p={8}
//         >
//           <Stack spacing={4}>
//             <GoogleLogin
//               clientId={clientId}
//               buttonText="Login"
//               onSuccess={onSuccess}
//               onFailure={onFailure}
//               cookiePolicy={"single_host_origin"}
//               //   style={{ marginTop: "100px" }}
//               isSignedIn={true}
//               width={"350px"}
//             />
//             {/* <div
//               id="g_id_onload"
//               data-client_id="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
//               data-context="signin"
//               data-ux_mode="popup"
//               //   data-login_uri="https://www.charterai.org/chat"
//               data-itp_support="true"
//             ></div>
//             <div
//               class="g_id_signin"
//               data-type="standard"
//               data-shape="rectangular"
//               data-theme="outline"
//               data-text="signin_with"
//               data-size="large"
//               data-logo_alignment="left"
//             ></div> */}

//             <Button
//               onClick={async () => {
//                 // document.location.href =
//                 //   "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://charterai.org/CharterAI/logoutUser";
//                 console.log("window.gapi=", window.gapi);
//                 // console.log("window.gapi.auth2=", window.gapi.auth2);
//                 // window.gapi.load("auth2", function () {
//                 //   window.gapi.auth2.init({
//                 //     client_id:
//                 //       "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
//                 //   });
//                 // })

//                 window.gapi.auth2.init({
//                   client_id:
//                     "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
//                 });
//                 var auth2 = window.gapi.auth2.getAuthInstance();
//                 await auth2.signIn();
//                 console.log("window.gapi.auth2.getAuthInstance()=", auth2);
//                 console.log(
//                   "gapi.auth2.getAuthInstance().isSignedIn.get()=",
//                   auth2.isSignedIn.get()
//                 );
//                 console.log(
//                   "auth2 info =-",
//                   auth2.currentUser.get().getBasicProfile()
//                 );
//                 console.log("auth2 info =-", auth2.clientId);

//                 auth2.signOut().then(function () {
//                   console.log("User signed out.");
//                 });
//                 googleLogout();
//               }}
//             >
//               {" "}
//               Logout{" "}
//             </Button>
//           </Stack>
//         </Box>
//       </Stack>
//     </Flex>
//   );
// };
// export default Login;

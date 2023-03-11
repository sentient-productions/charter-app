// import { Button } from "@chakra-ui/react";
// import { GoogleLogin } from "@react-oauth/google";
// import { googleLogout } from "@react-oauth/google";
// import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";

// const Login = () => {
//   //   const hasAccess = hasGrantedAllScopesGoogle(
//   //     tokenResponse,
//   //     "google-scope-1",
//   //     "google-scope-2"
//   //   );

//   return (
//     <>
//       <GoogleLogin
//         onSuccess={(credentialResponse) => {
//           console.log(credentialResponse);
//         }}
//         onError={() => {
//           console.log("Login Failed");
//         }}
//       />
//       <Button
//         onClick={() => {
//           googleLogout();
//         }}
//       >
//         {" "}
//         Logout{" "}
//       </Button>
//     </>
//   );
// };
// export default Login;

// import React from "react";
// import ReactDOM from "react-dom";
// import GitHubLogin from "react-github-login";
// import GoogleLogin from "react-google-login";

// const onSuccess = (response) => console.log(response);
// const onFailure = (response) => console.error(response);

// // github client id = cf71f7a338bf52d1c728

// const Login = () => {
//   return (
//     <GoogleLogin
//       clientId="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
//       onSuccess={onSuccess}
//       onFailure={onFailure}
//     />
//   );
// };

// export default Login;
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import "./login.css";
import { useGoogleApi } from "react-gapi";
import { gapi, loadAuth2 } from "gapi-script";
import { useEffect } from "react";
export default function SimpleCard() {
  //   const gapi = useGoogleApi({
  //     scopes: ["profile"],
  //   });

  //   console.log("gapi = ", gapi);

  //   const auth = gapi?.auth2.getAuthInstance();
  //   console.log("auth = ", auth);

  const logout = async () => {
    let auth2 = await loadAuth2(
      gapi,
      "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
      ""
    );
    console.log("auth2=", auth2);
    auth2.signOut().then(() => {
      console.log("User signed out.");
      auth2.disconnect();
      console.log("disconnecting..");
    });
  };

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          {/* <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text> */}
        </Stack>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <GoogleLogin
              //   className="rounded-circle"
              clientId="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              type={"standard"}
              //   text="xxxx"
              //   theme={"filled_black"}
              //   text="signin"
              //   size={"large"}
              //   shape="pill"
              width={"1000px"}
              login_uri={"http://localhost:3000/"}
              useOneTap
              //   onSuccess={onSuccess}
              //   onFailure={onFailure}
              //   cookiePolicy={"single_host_origin"}
              //   render={(renderProps) => {
              //     return <Button> x </Button>;
              //   }}
            />

            {/* <GoogleLogin
              //   className="GoogleButton" // Add a className prop
              size={"large"}
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              render={(props) => (
                <button
                //   onClick={props.onClick}
                //   disabled={props.disabled}
                //   className="GoogleButton"
                >
                  Sign in with Googles
                </button>
              )}
            /> */}
            <Button
              onClick={() => {
                console.log("logging out...");
                googleLogout();
                logout();
              }}
            >
              {" "}
              Logout{" "}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

import React from "react";
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext } from "../../contexts/account";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function App() {
  const { credentials, setCredentials } = useContext(AccountContext);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("tokenResponse= ", tokenResponse);
      setCredentials({ accessToken: tokenResponse.access_token, type: "jwt" });
      console.log("we should be navving");
      navigate("/chat");
    },
    onError: () => {
      console.log("Login Failed");
    },
    // flow: "auth-code",
    response_type: "id_token",
  });

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      setCredentials({
        accessToken: credentialResponse.credential,
        type: "google-auth",
      });
      navigate("/chat");
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
        <Center>
          <Heading fontSize={"4xl"}>Sign in</Heading>
        </Center>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential != null) {
                  console.log("credentialResponse = ", credentialResponse);
                  // const USER_CREDENTIAL: dataCredential = jwtDecode(credentialResponse.credential);
                  // console.log(USER_CREDENTIAL);
                  // const { given_name, family_name } = USER_CREDENTIAL;
                  // console.log(given_name, family_name)
                }
              }}
            >
              {" "}
            </GoogleLogin>
            {!credentials.accessToken ? (
              <Button
                leftIcon={<FaGoogle />}
                onClick={async () => {
                  googleLogin();
                }}
                colorScheme={"blue"}
              >
                {" "}
                Continue With Google{" "}
              </Button>
            ) : null}

            {credentials.accessToken ? (
              <Button
                onClick={async () => {
                  setCredentials({});
                }}
              >
                {" "}
                Logout{" "}
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default App;

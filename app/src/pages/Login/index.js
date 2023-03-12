import axios from "axios";
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
import { charterBackendURI } from "../../utils";

function App() {
  const { credentials, setCredentials } = useContext(AccountContext);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let formData = new FormData();
      formData.append("inputVal", tokenResponse.code);
      formData.append("inputType", "auth-code");
      formData.append("provider", "https://accounts.google.com");
      const userRequest = await axios.request({
        url: charterBackendURI + "/login",
        method: "POST",
        data: formData,
      });
      let userJSON = userRequest.data;
      console.log("userJSON=", userJSON);
      setCredentials(userJSON);
      navigate("/chat");
    },
    onError: () => {
      console.log("Login Failed");
    },
    flow: "auth-code",
  });

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      setCredentials({
        accessToken: credentialResponse.credential,
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

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
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function App() {
  const { credentials, setCredentials } = useContext(AccountContext);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setCredentials({ accessToken: tokenResponse.access_token });
      navigate("/chat");
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      setCredentials({ accessToken: credentialResponse.credential });
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
                  // googleLogout();
                  setCredentials({});
                }}
                //   width={"250px"}
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

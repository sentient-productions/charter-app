const Login = () => {
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="http://www.charterai.org/login"
        data-itp_support="true"
      ></div>

      <div
        class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
export default Login;
// export Login;
// import React from "react";

// import { GoogleLogin } from "react-google-login";
// // refresh token
// import { refreshTokenSetup } from "../../utils";
// import { GoogleLogout } from "react-google-login";

// const clientId =
//   "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com";

// function Login() {
//   const onSuccess = (res) => {
//     console.log("Login Success: currentUser:", res.profileObj);
//     alert(
//       `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
//     );
//     refreshTokenSetup(res);
//   };

//   const onFailure = (res) => {
//     console.log("Login failed: res:", res);
//     alert(
//       `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
//     );
//   };

//   const onSuccessLogOut = () => {
//     console.log("Logout made successfully");
//     alert("Logout made successfully ✌");
//   };

//   return (
//     <>
//       <div>
//         <GoogleLogin
//           clientId={clientId}
//           buttonText="Login"
//           onSuccess={onSuccess}
//           onFailure={onFailure}
//           cookiePolicy={"single_host_origin"}
//           style={{ marginTop: "100px" }}
//           isSignedIn={true}
//         />
//       </div>

//       <div>
//         <GoogleLogout
//           clientId={clientId}
//           buttonText="Logout"
//           onLogoutSuccess={onSuccessLogOut}
//         ></GoogleLogout>
//       </div>
//     </>
//   );
// }

// export default Login;
// // // import { Button } from "@chakra-ui/react";
// // // import { GoogleLogin } from "@react-oauth/google";
// // // import { googleLogout } from "@react-oauth/google";
// // // import { hasGrantedAnyScopeGoogle } from "@react-oauth/google";

// // // const Login = () => {
// // //   //   const hasAccess = hasGrantedAllScopesGoogle(
// // //   //     tokenResponse,
// // //   //     "google-scope-1",
// // //   //     "google-scope-2"
// // //   //   );

// // //   return (
// // //     <>
// // //       <GoogleLogin
// // //         onSuccess={(credentialResponse) => {
// // //           console.log(credentialResponse);
// // //         }}
// // //         onError={() => {
// // //           console.log("Login Failed");
// // //         }}
// // //       />
// // //       <Button
// // //         onClick={() => {
// // //           googleLogout();
// // //         }}
// // //       >
// // //         {" "}
// // //         Logout{" "}
// // //       </Button>
// // //     </>
// // //   );
// // // };
// // // export default Login;

// // // import React from "react";
// // // import ReactDOM from "react-dom";
// // // import GitHubLogin from "react-github-login";
// // // import GoogleLogin from "react-google-login";

// // // const onSuccess = (response) => console.log(response);
// // // const onFailure = (response) => console.error(response);

// // // // github client id = cf71f7a338bf52d1c728

// // // const Login = () => {
// // //   return (
// // //     <GoogleLogin
// // //       clientId="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
// // //       onSuccess={onSuccess}
// // //       onFailure={onFailure}
// // //     />
// // //   );
// // // };

// // // export default Login;
// // import {
// //   Flex,
// //   Box,
// //   FormControl,
// //   FormLabel,
// //   Input,
// //   Checkbox,
// //   Stack,
// //   Link,
// //   Button,
// //   Heading,
// //   Text,
// //   useColorModeValue,
// // } from "@chakra-ui/react";
// // import { GoogleLogin } from "@react-oauth/google";
// // import { googleLogout } from "@react-oauth/google";
// // // import GoogleLogout from "react-google-login";
// // // import { useGoogleLogout, useGoogleLogin } from "react-google-login";
// // import "./login.css";
// // // import { gapi, loadAuth2 } from "gapi-script";
// // import { useEffect, useCallback } from "react";
// // export default function SimpleCard() {
// //   //   const gapi = useGoogleApi({
// //   //     scopes: ["profile"],
// //   //   });

// //   //   console.log("gapi = ", gapi);

// //   //   const auth = gapi?.auth2.getAuthInstance();
// //   //   console.log("auth = ", auth);

// //   //   const { signOut } = useGoogleLogout({
// //   //     clientId:
// //   //       "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
// //   //     onLogoutSuccess: () => {
// //   //       console.log("login success");
// //   //     },
// //   //     onFailure: () => {
// //   //       console.log("log out faiure");
// //   //     },
// //   //   });

// //   //   const { signIn, loaded } = useGoogleLogin({
// //   //     clientId:
// //   //       "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
// //   //     cookiePolicy: "single_host_origin",
// //   //     onSuccess: () => {
// //   //       console.log("login success");
// //   //     },
// //   //     onFailure: () => {
// //   //       console.log("log out faiure");
// //   //     },
// //   //     isSignedIn: false,
// //   //   });

// //   //   const logout = async () => {
// //   //     // await signOut();

// //   //     console.log("gapi=", gapi);
// //   //     // await gapi.auth2.init();

// //   //     // let auth2 = await loadAuth2(
// //   //     //   gapi,
// //   //     //   "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
// //   //     //   ""
// //   //     // );

// //   //     if (!gapi.auth2) {
// //   //       gapi.load("auth2", function () {
// //   //         gapi.auth2.init({
// //   //           client_id:
// //   //             "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
// //   //         });
// //   //       });
// //   //     }
// //   //     console.log("gapi.auth2=", gapi.auth2);
// //   //     console.log(
// //   //       "is signed in = ",
// //   //       gapi.auth2.getAuthInstance().isSignedIn.get()
// //   //     );

// //   //     // await gapi.auth2.signOut();
// //   //     gapi.auth2
// //   //       .getAuthInstance()
// //   //       .signOut()
// //   //       .then(function () {
// //   //         console.log(
// //   //           "is signed in after = ",
// //   //           gapi.auth2.getAuthInstance().isSignedIn.get()
// //   //         );
// //   //         // prints 'true'
// //   //       });

// //   //     // console.log("gapi.auth2=", gapi.auth2);
// //   //     // const auth2 = gapi.auth2;
// //   //     // console.log("sign out");
// //   //     // await auth2.signOut();
// //   //     // console.log("disconnect");
// //   //     // await auth2.disconnect();
// //   //     // console.log("sign out");
// //   //     // await auth2.signOut();
// //   //     // console.log("disconnect");
// //   //     // await auth2.disconnect();

// //   //     // auth2.init();

// //   //     // // // auth2.init();
// //   //     // // // console.log("gapi.auth2.init()=", gapi.auth2.init());
// //   //     // auth2.signOut().then(() => {
// //   //     //   //   signOut();
// //   //     //   console.log("User signed out.");
// //   //     //   auth2.disconnect();
// //   //     //   auth2.isSignedIn.set(false);
// //   //     //   //   document.location.href =
// //   //     //   //     "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://charterai.org/CharterAI/logoutUser";
// //   //     //   //   signOut();

// //   //     //   console.log("auth2.currentUser.get()=", auth2.currentUser.get());
// //   //     //   console.log("disconnecting..");
// //   //     // });
// //   //   };

// //   //   useEffect(() => {
// //   //     logout();
// //   //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   //   }, []);

// //   //   if (!gapi.auth2) {
// //   //     gapi.load("auth2", function () {
// //   //       gapi.auth2.init({
// //   //         client_id:
// //   //           "393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com",
// //   //       });
// //   //     });
// //   //   }
// //   //   console.log("gapi.auth2 inline=", gapi.auth2);
// //   //   if (gapi.auth2) {
// //   //     console.log(
// //   //       "is signed in inline = ",
// //   //       gapi.auth2.getAuthInstance().isSignedIn.get()
// //   //     );
// //   //   }
// //   //   console.log("gapi.auth2=", window.gapi.auth2);

// //   return (
// //     <Flex
// //       minH={"100vh"}
// //       align={"center"}
// //       justify={"center"}
// //       bg={useColorModeValue("gray.50", "gray.800")}
// //     >
// //       <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
// //         <Stack align={"center"}>
// //           <Heading fontSize={"4xl"}>Sign in to your account</Heading>
// //           {/* <Text fontSize={"lg"} color={"gray.600"}>
// //             to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
// //           </Text> */}
// //         </Stack>

// //         <Box
// //           rounded={"lg"}
// //           bg={useColorModeValue("white", "gray.700")}
// //           boxShadow={"lg"}
// //           p={8}
// //         >
// //           <Stack spacing={4}>
// //             {/* <GoogleLogin
// //               //   className="rounded-circle"
// //               clientId="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
// //               onSuccess={(credentialResponse) => {
// //                 console.log(credentialResponse);
// //               }}
// //               onError={() => {
// //                 console.log("Login Failed");
// //               }}
// //               type={"standard"}
// //               //   text="xxxx"
// //               //   theme={"filled_black"}
// //               //   text="signin"
// //               //   size={"large"}
// //               //   shape="pill"
// //               width={"1000px"}
// //               login_uri={"http://localhost:3000/"}
// //               useOneTap
// //               //   onSuccess={onSuccess}
// //               //   onFailure={onFailure}
// //               //   cookiePolicy={"single_host_origin"}
// //               //   render={(renderProps) => {
// //               //     return <Button> x </Button>;
// //               //   }}
// //             /> */}

// //             <GoogleLogin
// //               //   className="GoogleButton" // Add a className prop
// //               size={"large"}
// //               onSuccess={(credentialResponse) => {
// //                 console.log(credentialResponse);
// //               }}
// //               onError={() => {
// //                 console.log("Login Failed");
// //               }}
// //               render={(props) => (
// //                 <button
// //                 //   onClick={props.onClick}
// //                 //   disabled={props.disabled}
// //                 //   className="GoogleButton"
// //                 >
// //                   Sign in with Googles
// //                 </button>
// //               )}
// //             />

// //             {/* <Button
// //               onClick={() => {
// //                 console.log("sign in...");
// //                 signIn();
// //               }}
// //             >
// //               {" "}
// //               sign in{" "}
// //             </Button> */}
// //             <script
// //               src="https://accounts.google.com/gsi/client"
// //               async
// //               defer
// //             ></script>

// //             <div
// //               id="g_id_onload"
// //               data-client_id="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
// //               data-login_uri="https://www.charterai.org/login"
// //               data-auto_prompt="false"
// //             ></div>
// //             {/* <div
// //               class="g_id_signin"
// //               data-type="standard"
// //               data-size="large"
// //               data-theme="outline"
// //               data-text="sign_in_with"
// //               data-shape="rectangular"
// //               data-logo_alignment="left"
// //             ></div> */}

// //             <div class="g_id_signout">Sign Out</div>

// //             {/* <div class="g_id_signout">
// //               <Button
// //                 onClick={async () => {
// //                   console.log("logging out...");
// //                   // googleLogout();
// //                   await googleLogout();
// //                   // await logout();
// //                   console.log("refreshing..");
// //                   window.location.href = "https://www.charterai.org";

// //                   // window.location.reload();
// //                   // console.log("refreshed..");

// //                   // window.location.reload(false);
// //                 }}
// //               >
// //                 {" "}
// //                 Logout{" "}
// //               </Button> */}
// //             {/* <GoogleLogout
// //               clientId="393331770643-ah9rnhe7hfl3vuecneggpmnkk8p2o904.apps.googleusercontent.com"
// //               buttonText="Logout"
// //               //   onLogoutSuccess={logout}
// //             ></GoogleLogout> */}
// //           </Stack>
// //         </Box>
// //       </Stack>
// //     </Flex>
// //   );
// // }
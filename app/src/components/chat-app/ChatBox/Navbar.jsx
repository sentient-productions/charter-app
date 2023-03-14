import { useRef } from "react";

import {
  Box,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  Input,
  useDisclosure,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import Sidebar from "../Sidebar";
import { FaBars } from "react-icons/fa";
const Navbar = ({ chatState, setChatState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <Box
      className="navBar"
      //   alignContent={"flex-start"}
      //   justifyContent={"flex-start"}
      width={"100%"}
      zIndex={1000000}
    >
      <Flex justifyContent="flex-start">
        <IconButton
          ref={btnRef}
          colorScheme="blue"
          onClick={onOpen}
          variant="text"
        >
          {/* Open */}
          <FaBars />
        </IconButton>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent mt={"5vh"}>
            <DrawerCloseButton />
            <Sidebar chatState={chatState} setChatState={setChatState} />

            {/* <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
export default Navbar;

import {
  Avatar,
  Container,
  ButtonGroup,
  IconButton,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  useEditableControls,
  Box,
  Flex,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import {
  FaCheck as CheckIcon,
  FaEdit as EditIcon,
  FaWindowClose as CloseIcon,
  // FaArrowRight as ArrowRightIcon,
} from "react-icons/fa";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { getNewChatId } from "../../../utils";
import { useEffect, useState } from "react";

function EditableBox({ defaultVal, chatState, setChatState, idx }) {
  const [localChatIdx, setLocalChatIdx] = useState(0);
  const { system, chatLogVec, chatId, chatBranchPoints, isLoading } = chatState;
  let chatIdsTemp = [chatId];

  Object.keys(chatBranchPoints).forEach((key) => {
    if (chatBranchPoints[key] == idx) {
      chatIdsTemp.push(parseInt(key));
    }
  });

  const [chatIds, setChatIds] = useState(chatIdsTemp);
  const chatLog = chatLogVec[chatId] || [];

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup size="md">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <ButtonGroup size="md" isDisabled={isLoading}>
        {chatIds?.length > 1 && (
          <>
            <IconButton
              isDisabled={localChatIdx == 0}
              size="md"
              icon={<ArrowLeftIcon />}
              onClick={() => {
                setLocalChatIdx(localChatIdx - 1);
                setChatState({
                  ...chatState,
                  chatId: chatIds[localChatIdx - 1],
                });
              }}
            />
            <IconButton
              isDisabled={localChatIdx == chatIds?.length - 1}
              size="md"
              icon={<ArrowRightIcon />}
              onClick={() => {
                setLocalChatIdx(localChatIdx + 1);
                setChatState({
                  ...chatState,
                  chatId: chatIds[localChatIdx + 1],
                });
              }}
            />
          </>
        )}
        <IconButton size="md" icon={<EditIcon />} {...getEditButtonProps()} />
      </ButtonGroup>
    );
  }

  const [newDefaultVal, setNewDefaultVal] = useState(defaultVal);

  useEffect(() => {
    setNewDefaultVal(chatLog[idx].content);
  }, [chatState]);

  return (
    <div key={`${system}-${chatId}-${newDefaultVal.slice(0, 20)}`}>
      <Editable
        textAlign="left"
        defaultValue={newDefaultVal}
        fontSize="l"
        isPreviewFocusable={false}
        onSubmit={(value) => {
          /// wtf, fix this shit
          console.log("in edit, before anything = ", chatLogVec);
          const newChatId = getNewChatId();
          let newChatLog = JSON.parse(
            JSON.stringify(chatLog.slice(0, idx + 1))
          );
          newChatLog[newChatLog.length - 1].content = value;
          console.log("in edit, before assign newChatLog = ", newChatLog);
          let newChatLogVec = Object.assign({}, chatLogVec);
          console.log("in edit, after assign chatLogVec = ", chatLogVec);
          newChatLogVec[newChatId] = newChatLog;
          console.log("in edit, after assign newChatLogVec = ", newChatLogVec);

          let newChatBranchPoints = Object.assign(
            {},
            chatState.chatBranchPoints
          );
          if (chatState.chatBranchPoints[idx]) {
            newChatBranchPoints[newChatId].push(idx);
          } else {
            newChatBranchPoints[newChatId] = [idx];
          }
          setChatState({
            ...chatState,
            chatLogVec: newChatLogVec,
            chatId: newChatId,
            chatBranchPoints: newChatBranchPoints,
          });
          setChatIds([...chatIds, newChatId]);
          setLocalChatIdx(chatIds?.length);
        }}
      >
        <Flex>
          <pre>
            <EditablePreview />
          </pre>
          {/* <Input as={EditableInput} /> */}
          <EditableInput />
          <Spacer />
          <EditableControls sx={{ "align-items": "start" }} />
        </Flex>
      </Editable>
    </div>
  );
}

export default EditableBox;

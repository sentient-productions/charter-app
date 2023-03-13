import {
  Avatar,
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
} from "@chakra-ui/react";
import {
  FaCheck as CheckIcon,
  FaEdit as EditIcon,
  FaWindowClose as CloseIcon,
  // FaArrowRight as ArrowRightIcon,
} from "react-icons/fa";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { getNewConversationId } from "../../../utils";
import { useEffect, useState } from "react";

function EditableBox({
  defaultVal,
  chatLog,
  chatLogVec,
  setChatLogVec,
  selectedChatId,
  setSelectedChatId,
  system,
  idx,
}) {
  const [localChatIdx, setLocalChatIdx] = useState(0);
  const [chatIds, setChatIds] = useState([selectedChatId]);

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <Box width={1} height={1} ml={5}>
        <ButtonGroup justifyContent="end" size="md">
          <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
          <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
      </Box>
    ) : (
      <Box width={50} height={1} ml={5}>
        <ButtonGroup justifyContent="end" size="md">
          {chatIds.length > 1 && (
            <>
              <IconButton
                isDisabled={localChatIdx == 0}
                size="md"
                icon={<ArrowLeftIcon />}
                onClick={() => {
                  setLocalChatIdx(localChatIdx - 1);
                  setSelectedChatId(chatIds[localChatIdx - 1]);
                }}
              />
              <IconButton
                isDisabled={localChatIdx == chatIds.length - 1}
                size="md"
                icon={<ArrowRightIcon />}
                onClick={() => {
                  setLocalChatIdx(localChatIdx + 1);
                  setSelectedChatId(chatIds[localChatIdx + 1]);
                }}
              />
            </>
          )}
          <IconButton size="md" icon={<EditIcon />} {...getEditButtonProps()} />
        </ButtonGroup>
      </Box>
    );
  }

  const [newDefaultVal, setNewDefaultVal] = useState(defaultVal);
  useEffect(() => {
    setNewDefaultVal(chatLogVec[selectedChatId][idx].content);
  }, [chatLogVec, selectedChatId, system]);

  return (
    <div key={`${system}-${selectedChatId}-${newDefaultVal.slice(0, 20)}`}>
      <Editable
        // key={`${system}-${selectedChatId}-2`}
        textAlign="left"
        defaultValue={newDefaultVal}
        fontSize="l"
        isPreviewFocusable={false}
        onSubmit={(value) => {
          const conversationId = getNewConversationId();
          // let newChatLog = Object.assign({}, chatLog.slice(0, idx + 1));
          let newChatLog = JSON.parse(
            JSON.stringify(chatLog.slice(0, idx + 1))
          );
          newChatLog[idx].content = value;

          let newChatLogVec = JSON.parse(JSON.stringify(chatLogVec));
          newChatLogVec[conversationId] = newChatLog;

          let newChatIds = [...chatIds];
          newChatIds.push(conversationId);
          setChatLogVec(newChatLogVec);
          setSelectedChatId(conversationId);
          setChatIds(newChatIds);
          setLocalChatIdx(chatIds.length);
        }}
      >
        <Flex>
          <pre>
            <EditablePreview />
          </pre>
          <Input as={EditableInput} />
          <Spacer />
          <EditableControls />
        </Flex>
      </Editable>
    </div>
  );
}

export default EditableBox;

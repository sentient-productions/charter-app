import { Box, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { initChatData } from "../../../misc/PromptUtils";

const SelectBox = ({
  title,
  primaryChatId,
  initialized,
  chatState,
  setChatState,
}) => {
  return (
    <Box className="selectBox" mt={1} mb={5}>
      <FormControl key={primaryChatId}>
        <FormLabel as="legend" fontSize="xl" fontWeight={"bold"}>
          {title}
        </FormLabel>
        <Select
          height={"50px"}
          fontSize="xl"
          onChange={(x) => {
            setChatState({ ...chatState, system: x.target.value });
          }}
          isDisabled={initialized}
        >
          <option value="">Select here or click below</option>
          {Object.keys(initChatData).map((key) => {
            if (key != "") {
              return (
                <option value={key}>{initChatData[key]["longName"]}</option>
              );
            }
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectBox;

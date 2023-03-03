import React from "react";
import BotResponse from "./BotResponse";

import { ReactElement } from 'react';
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function SimpleThreeColumns() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'Lifetime Support'}
          text={
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={'Unlimited Donations'}
          text={
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'Instant Delivery'}
          text={
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...'
          }
        />
      </SimpleGrid>
    </Box>
  );
}
// const IntroSection = () => {
//   return (
//     <div id="introsection">
//       <h1>
//         Introducing Talkbot
//         <BotResponse response=" - The Ultimate AI Assistant" />
//       </h1>
//       <h2>
//         A cutting-edge AI-powered app that provides instant answers to any
//         question you may have. With Talkbot, you'll never be left searching for
//         answers again. Whether you need information for school or work, or just
//         want to know the latest news, Talkbot has you covered.
//       </h2>
//       <p>
//         Features:
//         <ul>
//           <li>Instant answers to any question</li>
//           <li>Deep learning technology that improves with usage</li>
//           <li>Continuously Learning</li>
//           <li>User-friendly interface</li>
//           <li>Available 24/7</li>
//         </ul>
//       </p>
//       <p>
//         Say goodbye to endless searching and typing, and say hello to TalkBot,
//         your personal AI assistant. Try it now and see for yourself how TalkBot
//         can make your life easier.
//       </p>
//     </div>
//   );
// };

// export default IntroSection;

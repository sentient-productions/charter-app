import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Icon,
    Text,
    Stack,
    HStack,
    VStack,
  } from '@chakra-ui/react';
  import { CheckIcon } from '@chakra-ui/icons';
  
  // Replace test data with your own
//   const features = Array.apply(null, Array(4)).map(function (x, i) {
//     return {
//       id: i,
//       title: 'Lorem xxx dolor sit amet',
//       text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
//     };
//   });
  
  const features = [
    {id: 0, title: 'Unique Conversations', text: 'Changing the system prompt can make each chat a unique experience.'},
    {id: 1, title: 'Editable Chat', text: 'Modify both your input and the CharterAI output on the fly to steer your conversation in the right direction.'},
    {id: 2, title: 'Lightning Fast', text: 'CharterAI provides near-instant responses using the OpenAI chatgpt API.'},
    {id: 3, title: 'Lightning Fast', text: 'Near-instant conversation completion.'}
]
  export default function GridListWithHeading() {
    return (
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Charter</Heading>
          <Text color={'green.400'} fontSize={'xl'} fontWeight={"bold"}>
            AI governed by the people
          </Text>
          <Text pt={8}  fontSize={'xl'}>We believe that AI ought be governed by a community of engaged and interested users, to minimize the potential for misuse. The Charter agent is the communities first attempt at enabling guide the direction of this new disruptive technology. By selecting the Charter system prompt you will engage with an agent that has been instructed to act in accordance with the values decided by the Charter community.</Text>
        </Stack>
      </Box>
    );
  }
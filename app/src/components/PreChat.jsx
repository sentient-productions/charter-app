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
          <Heading fontSize={'3xl'}>CharterAI</Heading>
          <Text color={'green.400'} fontSize={'xl'}>
            Steer your conversation with the top rated system prompts from our community!
          </Text>
        </Stack>
  
        <Container maxW={'6xl'} mt={10}>
          <SimpleGrid columns={{ base: 3, md: 3, lg: 4 }} spacing={10} >
            {features.map((feature) => (
              <HStack key={feature.id} align={'top'}>
                <Box color={'green.400'} px={2}>
                  <Icon as={CheckIcon} />
                </Box>
                <VStack align={'start'}>
                  <Text fontWeight={600} >{feature.title}</Text>
                  <Text color={'white.400'}>{feature.text}</Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }
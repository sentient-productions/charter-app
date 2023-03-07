import {
    Box,
    Container,
    Heading,
    Text,
    Stack,
  } from '@chakra-ui/react';
  
  export default function GridListWithHeading() {
    return (
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Charter <br />
            <Text color={'green.400'} fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }} fontWeight={"bold"}>
            AI governed by the people
          </Text>          
        </Heading>          
          <Text pt={8}  fontSize={{ base: 'xl', sm: 'xl', md: '2xl' }} textAlign={'center'}>
            {`We believe that AI should be governed by a community of engaged and informed users to minimize the potential for misuse or misalignemnt with democratic human values.`} 
          </Text>
          <Text pt={8}  fontSize={{ base: 'xl', sm: 'xl', md: '2xl' }} textAlign={'center'}>
          {`This chat agent is the community's first attempt at guiding the direction of this new disruptive technology. Select a system prompt to guide your chat with the AI and share your experiences on our Discord, Reddit, or Discourse.`}
          </Text>
        </Stack>
      </Box>
    );
  }
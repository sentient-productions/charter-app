import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';

export default function CallToActionWithAnnotation() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={'3xl'} py={125}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          // py={{ base: 10, md: 20 }}
          mb={-10}
          >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '8xl' }}
            lineHeight={'110%'}>
            Charter is <br />
            <Text as={'span'} fontSize={{ base: 'xl', sm: '2xl', md: '6xl' }} color={'blue.200'}>
              AI governed by the people
            </Text>
          </Heading>

          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              size="lg"
              colorScheme={'blue'}
              rounded={'full'}
              px={6}
              fontSize={"xl"}
              _hover={{
              }}>
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
import {
  Box,
  VStack,
  Button,
  Flex,
  Divider,
  chakra,
  Grid,
  GridItem,
  Container,
} from '@chakra-ui/react';
import {} from '@chakra-ui/react';

const Feature = ({ heading, text }) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {heading}
      </chakra.h3>
      <chakra.p>{text}</chakra.p>
    </GridItem>
  );
};

export default function gridListWithCTA() {
  return (
    <Box as={Container} maxW="7xl" mt={0} p={4}>
      <Divider mt={12} mb={12} bg="white" />
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={4}>
        <GridItem colSpan={1}>
          <VStack alignItems="flex-start" spacing="20px">
            <chakra.h2 fontSize="3xl" fontWeight="700">
              AI will disrupt our society
            </chakra.h2>
            <Button colorScheme="green" size="md">
              Help us chart a course
            </Button>
          </VStack>
        </GridItem>
        <GridItem>
          <Flex>
            <chakra.p>
            The advent of social media has already shown the world how disruptive new
technology can be. The pace of progress is only accelerating and it is expected
that artificial general intelligence (AGI) will have a great impact on our society.
            </chakra.p>
          </Flex>
        </GridItem>
      </Grid>
      <Divider mt={12} mb={12} bg="white" />
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={{ base: '8', sm: '12', md: '16' }}>
        <Feature
          heading={'Participate'}
          text={'Join the community for serious discussions around the latest advances in AI'}
        />
        <Feature
          heading={'Help Govern'}
          text={'Contribute to training the behavior and ethics of Charters\' AI system'}
        />
        <Feature
          heading={'Get Value'}
          text={'Earn rewards for vour participation in governance, interact with the AI as a user'}
        />
        <Feature
          heading={'Iterate'}
          text={'Shape the values of the proiect over time as this technology continues to advance'}
        />
      </Grid>
    </Box>
  );
}
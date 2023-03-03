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
  
  interface FeatureProps {
    heading: string;
    text: string;
  }
  
  const Feature = ({ heading, text }: FeatureProps) => {
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
        <Divider mt={0} mb={12} borderColor={"black"}/>        
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
                <Button colorScheme="green" size="md" fontSize={"m"}>
                    Help us chart a course
                </Button>
            </VStack>
          </GridItem>
          <GridItem>
            <Flex>
              <chakra.p>
                The advent of social media has already shown the world how disruptive new technology can be. The pace of progress is only accelerating and it is expected that artificial general intelligence (AGI) will have a great impact on our society.
              </chakra.p>
            </Flex>
          </GridItem>
        </Grid>
        <Divider mt={12} mb={12} borderColor={"black"}/>
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
            text={'Earn rewards for your participation in governance, interact with the AI as a user'}
          />
          <Feature
            heading={'Iterate'}
            text={'Shape Charters\' values over time as this technology continues to advance'}
          />
        </Grid>
      </Box>
    );
  }
// import {
//     Box,
//     Container,
//     Heading,
//     SimpleGrid,
//     Icon,
//     Text,
//     Stack,
//     HStack,
//     VStack,
//   } from '@chakra-ui/react';
//   import { CheckIcon } from '@chakra-ui/icons';
  
//   // Replace test data with your own
//   const features = Array.apply(null, Array(8)).map(function (x, i) {
//     return {
//       id: i,
//       title: 'Lorem ipsum dolor sit amet',
//       text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
//     };
//   });
  
//   export default function Content() {
//     return (
//       <Box p={4}>
//         <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
//           <Heading fontSize={'3xl'}>AI will be disruptive</Heading>
//           <Text color={'gray.600'} fontSize={'xl'}>
//             Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
//             nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
//             sed diam voluptua.
//           </Text>
//         </Stack>
  
//         <Container maxW={'6xl'} mt={10}>
//           <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
//             {features.map((feature) => (
//               <HStack key={feature.id} align={'top'}>
//                 <Box color={'green.400'} px={2}>
//                   <Icon as={CheckIcon} />
//                 </Box>
//                 <VStack align={'start'}>
//                   <Text fontWeight={600}>{feature.title}</Text>
//                   <Text color={'gray.600'}>{feature.text}</Text>
//                 </VStack>
//               </HStack>
//             ))}
//           </SimpleGrid>
//         </Container>
//       </Box>
//     );
//   }
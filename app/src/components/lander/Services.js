import {
  Box,
  Button,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';


const options = [
  { id: 1, desc: 'x' },
  { id: 2, desc: 'Lorem, ipsum dolor.' },
  { id: 3, desc: 'Monthly Updates' },
];


const options1 = [
  { id: 1, desc: 'Discussion and voting on aligning values' },
  { id: 2, desc: 'Drafting, testing and iterating on system prompt' },
  { id: 3, desc: 'Initial construction and testing of value-aligned RLHF training set' },
];

const options2 = [
  { id: 1, desc: 'Non-profit foundation tunes pre-trained LLM with community dataset' },
  { id: 2, desc: 'Model available for inference, community votes on releasing weights' },
  { id: 3, desc: 'Iteration on aligning values, RLHF dataset, and training approach' },
];

const options3 = [
  { id: 1, desc: 'Release token incentives in accordance with overall contribution' },
  { id: 2, desc: 'Stive towards safely decentralizing training and inference of models' },
  // { id: 3, desc: 'Iteration on aligning values, RLHF dataset, and training approach' },
];

interface PackageTierProps {
  title: string;
  options: Array<{ id: number; desc: string }>;
  typePlan: string;
  checked?: boolean;
}
const PackageTier = ({
  title,
  options,
  typePlan,
  checked = false,
}: PackageTierProps) => {
  const colorTextLight = checked ? 'white' : 'purple.600';
  const bgColorLight = checked ? 'purple.400' : 'gray.300';

  const colorTextDark = checked ? 'white' : 'purple.500';
  const bgColorDark = checked ? 'purple.400' : 'gray.300';

  return (
    <Stack
      p={3}
      py={3}
      justifyContent={{
        base: 'flex-start',
        md: 'space-around',
      }}
      direction={{
        base: 'column',
        md: 'row',
      }}
      alignItems={{ md: 'center' }}>
      <Heading size={'md'}>{title}</Heading>
      <List spacing={3} textAlign="start">
        {options.map((desc, id) => (
          <ListItem key={desc.id}>
            <ListIcon as={FaCircle} color="green.500" />
            {desc.desc}
          </ListItem>
        ))}
      </List>
      <Heading size={'xl'}>{typePlan}</Heading>
      {/* <Stack>
        <Button
          size="md"
          color={useColorModeValue(colorTextLight, colorTextDark)}
          bgColor={useColorModeValue(bgColorLight, bgColorDark)}>
          Get Started
        </Button>
      </Stack> */}
    </Stack>
  );
};
const ThreeTierPricingHorizontal = () => {
  return (
    <Box py={19} px={5} min={'100vh'}>
      <Stack spacing={4} width={'100%'} direction={'column'}>
        <Stack
          p={5}
          alignItems={'center'}
          justifyContent={{
            base: 'flex-start',
            md: 'space-around',
          }}
          direction={{
            base: 'column',
            md: 'row',
          }}>
          <Stack
            width={{
              base: '100%',
              md: '40%',
            }}
            textAlign={'center'}>
            <Heading size={'lg'}>
              The Roadmap <Text color="purple.400">Progressive Decentralization</Text>
            </Heading>
          </Stack>
          <Stack
            width={{
              base: '100%',
              md: '60%',
            }}>
            <Text textAlign={'center'}>
              We are working as a community to achieve a democratic and open process of AI model creation. The roadmap below is designed to optimally trade-off between progress, decentralization and safety in AI creation.
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <PackageTier title={'Phase I'} typePlan=" " options={options1} />
        <Divider />
        <PackageTier title={'Phase II'} checked={true} typePlan="" options={options2}/>
        <Divider />
        <PackageTier title={'Phase III'} typePlan=" " options={options3} />
      </Stack>
    </Box>
  );
};

export default ThreeTierPricingHorizontal;


// import {
//   Flex,
//   Spacer,
//   Image,
//   Text,
//   Button,
//   useMediaQuery,
// } from '@chakra-ui/react';
// import React from 'react';
// import teamImage from '../assets/teamImage.jpg';

// const Services = () => {
//   const [isLargerThanLG] = useMediaQuery('(min-width: 62em)');

//   return (
//     <Flex
//       width="full"
//       minHeight="70vh"
//       alignItems="center"
//       px={isLargerThanLG ? '16' : '6'}
//       py="16"
//       justifyContent="center"
//       flexDirection={isLargerThanLG ? 'row' : 'column'}
//     >
//       <Flex
//         w={isLargerThanLG ? '40%' : 'full'}
//         mb={isLargerThanLG ? '0' : '6'}
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Image src={teamImage} alt="Chakra Team" w="full" />
//       </Flex>
//       <Spacer />
//       <Flex
//         w={isLargerThanLG ? '60%' : 'full'}
//         flexDirection="column"
//         ml={isLargerThanLG ? '7' : '0'}
//       >
//         <Text fontSize={isLargerThanLG ? '5xl' : '4xl'} fontWeight="bold">
//           We build, We revive
//         </Text>

//         <Text mb="6" opacity="0.8">
//           Your business needs to be in safe hands at all times. We ensure you
//           never run out of customers and not run at loss. We are trusted by over
//           500+ companies to deliver quality marketing campaigns using Digital
//           marketing & Offline marketing channels.
//         </Text>

//         <Button width="200px" size="lg" colorScheme="blue">
//           CONTACT US
//         </Button>
//       </Flex>
//     </Flex>
//   );
// };

// export default Services;
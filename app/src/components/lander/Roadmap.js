import {
  Box,
  Container,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';

const featuress1 = [
  { id: 1, desc: 'Discussion and voting on aligning values' },
  { id: 2, desc: 'Drafting, testing and iterating on system prompt' },
  { id: 3, desc: 'Initial construction and testing of value-aligned RLHF training set' },
];

const featuress2 = [
  { id: 1, desc: 'Non-profit foundation tunes pre-trained LLM with community dataset' },
  { id: 2, desc: 'Model available for inference, community votes on releasing weights' },
  { id: 3, desc: 'Iteration on aligning values, RLHF dataset, and training approach' },
];

const featuress3 = [
  { id: 1, desc: 'Release token incentives in accordance with overall contribution' },
  { id: 2, desc: 'Stive towards safely decentralizing training and inference of models' },
];

const RoadmapItem = ({
  title,
  featuress,
  typePlan,
}) => {

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
        {featuress.map((desc, id) => (
          <ListItem key={desc.id} width={"700px"}>
            <ListIcon as={FaCircle} color="green.500" />
            {desc.desc}
          </ListItem>
        ))}
      </List>
      <Heading size={'xl'}>{typePlan}</Heading>
    </Stack>
  );
};
const Roadmap = () => {
  return (
      <Container maxW={'5xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          py={{ base: 10, md: 20 }}
          mb={-10}
          >
          <Stack
            // p={5}
            mt={8}
            mb={20}
            alignItems={'center'}
            justifyContent={{
              base: 'flex-start',
              md: 'space-around',
            }}
            direction={{
              base: 'column',
              md: 'row',
            }}
            >
            <Stack
              width={{
                base: '100%',
                md: '40%',
              }}
              textAlign={'center'}
              >
              <Heading fontSize={{ base: 'l', sm: '2xl', md: '4xl' }}>
                The Roadmap <Text color="purple.400">Progressive Decentralization</Text>
              </Heading>
            </Stack>
            <Stack
              width={{
                base: '100%',
                md: '60%',
              }}
              >
              <Text textAlign={'left'} fontSize={'2xl'}>
                We are working as a community to achieve a democratic and open process of AI model creation. The roadmap below is designed to optimally trade-off between progress, decentralization and safety in AI creation.
              </Text>
            </Stack>
          </Stack>
          <Divider />
          <RoadmapItem title={'Phase I'} typePlan=" " featuress={featuress1} />
          <Divider />
          <RoadmapItem title={'Phase II'} checked={true} typePlan="" featuress={featuress2}/>
          <Divider />
          <RoadmapItem title={'Phase III'} typePlan=" " featuress={featuress3} />
        </Stack>
    </Container>  
  );
};

export default Roadmap;
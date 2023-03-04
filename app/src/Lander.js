import AboutUs from './components/lander/Features';
import ContactUs from './components/lander/ContactUs';
import Footer from './components/lander/Footer';
import Hero from './components/lander/Hero';
import Nav from './components/lander/Nav';
import Services from './components/lander/Services';
import Testimonials from './components/lander/Testimonials';
import React, { useRef } from 'react';
import { useDisclosure, Box } from '@chakra-ui/react';
import DrawerComponent from './components/lander/DrawerComponent';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <Box>
      <Nav ref={btnRef} onOpen={onOpen} />
      <Hero />
      <AboutUs />
      <Services />
      <Testimonials />
      <ContactUs />
      <Footer />
      <DrawerComponent isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  );
}

export default App;
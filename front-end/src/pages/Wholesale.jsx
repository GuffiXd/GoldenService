import React from 'react';
import Header from '../components/layout/Header';
import Promocode from '../components/layout/Promocode';
import Footer from '../components/layout/Footer';
import WholesaleForm from '../components/sections/WholesaleForm';
import HowWeWork from '../components/sections/HowWeWork';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import OurProjectsSlider from '../components/sections/OurProjectsSlider';

function Wholesale() {
  return (
    <div>
      <Promocode />
      <Header />
      <WholesaleForm/>
      <HowWeWork />
      <WhyChooseUs />
      <OurProjectsSlider />
      <Footer />
    </div>
  );
}

export default Wholesale;
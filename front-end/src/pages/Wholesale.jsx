import React from 'react';
import Header from '../components/layout/Header';
import Promocode from '../components/layout/Promocode';
import Footer from '../components/layout/Footer';
import WholesaleForm from '../components/sections/WholesaleForm';
import HowWeWork from '../components/HowWeWork';
import WhyChooseUs from '../components/WhyChooseUs';
import OurProjectsSlider from '../components/OurProjectsSlider';

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
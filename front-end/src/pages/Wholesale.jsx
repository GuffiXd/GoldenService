import React from 'react';
import Header from '../components/Header';
import Promocode from '../components/Promocode';
import Footer from '../components/Footer';
import WholesaleForm from '../components/WholesaleForm';
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
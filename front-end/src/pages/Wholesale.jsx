import React from 'react';
import WholesaleForm from '../components/sections/WholesaleForm';
import HowWeWork from '../components/sections/HowWeWork';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import OurProjectsSlider from '../components/sections/OurProjectsSlider';

function Wholesale() {
  return (
    <div>
      <WholesaleForm/>
      <HowWeWork />
      <WhyChooseUs />
      <OurProjectsSlider />
    </div>
  );
}

export default Wholesale;
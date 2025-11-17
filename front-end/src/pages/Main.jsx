// src/pages/Main.jsx
import React from 'react';
import PromoBanner from '../components/sections/PromoBanner';
import WhyUsSection from "../components/sections/WhyUsSection"
import Statistics from '../components/layout/Statistics';
import CategoriesSection from '../components/sections/CategoriesSection';
import PopularProducts from '../components/sections/PopularProducts';
import WholesalePromoSection from '../components/sections/WholesalePromoSection';
import AboutPromoSection from '../components/sections/AboutPromoSection';

function Main() {
  return (
    <div>
      <PromoBanner />
      <Statistics />
      <WhyUsSection />
      <CategoriesSection />
      <WholesalePromoSection />
      <AboutPromoSection />
      <PopularProducts />
    </div>
  );
}

export default Main;
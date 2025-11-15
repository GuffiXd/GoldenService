// src/pages/Main.jsx
import React from 'react';
import Header from '../components/layout/Header';
import PromoBanner from '../components/sections/PromoBanner';
import Promocode from '../components/layout/Promocode';
import Footer from '../components/layout/Footer';
import WhyUsSection from "../components/sections/WhyUsSection"
import Statistics from '../components/layout/Statistics';
import CategoriesSection from '../components/sections/CategoriesSection';
import PopularProducts from '../components/PopularProducts';
import WholesalePromoSection from '../components/sections/WholesalePromoSection';
import AboutPromoSection from '../components/sections/AboutPromoSection';

function Main() {
  return (
    <div>
      <Promocode />
      <Header />
      <PromoBanner />
      <Statistics />
      <WhyUsSection />
      <CategoriesSection />
      <WholesalePromoSection />
      <AboutPromoSection />
      <PopularProducts />
      <Footer />
    </div>
  );
}

export default Main;
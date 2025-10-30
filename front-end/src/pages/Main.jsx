// src/pages/Main.jsx
import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Promocode from '../components/Promocode';
import Footer from '../components/Footer';

function Main() {
  return (
    <div>
      <Promocode />
      <Header />
      <Slider />
      <Footer />
    </div>
  );
}

export default Main;
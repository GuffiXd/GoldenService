import React from "react";
import Header from "../components/layout/Header";
import Promocode from "../components/layout/Promocode";
import AboutSection from "../components/sections/AboutSection";
import Statistics from "../components/layout/Statistics";
import MissionSection from "../components/sections/MissionSection";
import AboutFooter from "../components/layout/FooterAbout";

function About() {
  return (
    <div>
      <Promocode />
      <Header />
      <AboutSection />
      <Statistics />
      <MissionSection />
      <AboutFooter />
    </div>
  );
}

export default About;

import React from "react";
import Header from "../components/Header";
import Promocode from "../components/Promocode";
import AboutSection from "../components/AboutSection";
import Statistics from "../components/Statistics";
import MissionSection from "../components/MissionSection";
import AboutFooter from "../components/FooterAbout";

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

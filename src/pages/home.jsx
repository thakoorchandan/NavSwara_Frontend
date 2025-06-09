import Sections from '../components/sections';
import Hero from '../components/hero';
import Ourpolicy from '../components/ourpolicy';
import Newsletterbox from '../components/newsletterbox';
import { useState } from 'react';

const Home = () => {
  const [theme, setTheme] = useState("light");

  return (
    <div className={`${theme === "dark" ? "dark:text-gray-200 dark:bg-gray-900" : "text-black"}`}>
      <Hero theme={theme} />
      <Sections theme={theme} />   {/* DYNAMIC! */}
      <Ourpolicy theme={theme} />
      <Newsletterbox theme={theme} />
    </div>
  );
};

export default Home;

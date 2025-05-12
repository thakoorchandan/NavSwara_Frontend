import Bestseller from '../components/bestseller';
import Hero from '../components/hero';
import LatestCollection from '../components/latestcollection';
import Ourpolicy from '../components/ourpolicy';
import Newsletterbox from '../components/newsletterbox';
import { useState } from 'react';

const Home = () => {
  const [theme, setTheme] = useState("light"); // Theme state

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`${theme === "dark" ? "dark:text-gray-200 dark:bg-gray-900" : "bg-white text-black"}`}>
      <Hero theme={theme} />
      <LatestCollection theme={theme} />
      <Bestseller theme={theme} />
      <Ourpolicy theme={theme} />
      <Newsletterbox theme={theme} />
    </div>
  );
};

export default Home;

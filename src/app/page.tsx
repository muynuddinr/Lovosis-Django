import Navbar from './Components/Navbar';
import Loader from './Components/Loader';
// import Hero from './Components/Herosection';
import Image from './Components/Imagetext';
import Why from './Components/Whychooseus';
import Services from './Components/Ourservices';
import ShuffleHero from './Components/ShuffleHero';
import Footer from './Components/Footer';

export default function Home() {
  return (
    <div>
      <Loader />
      <Navbar />
      <ShuffleHero />
      {/* <Hero /> */}
      <Image />
      <Why />
      <Services />
      <ShuffleHero />
      <Footer />
    </div>
  );
}

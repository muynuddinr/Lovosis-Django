import Loader from './Components/Loader';
// import Hero from './Components/Herosection';
import Banner from './Components/Banner';
import Image from './Components/Imagetext';
import Why from './Components/Whychooseus';
import Services from './Components/Ourservices';
import ShuffleHero from './Components/ShuffleHero';
import Faq from './Components/Faq';
import ProductSlider from './Components/ProductSlider';

export default function Home() {
  return (
    <div>
      <Loader />

      <Banner />
      <ProductSlider />
      <ShuffleHero />
      {/* <Hero /> */}
      <Image />
      <Services />
      <Why />
      <Faq />

    </div>
  );
}

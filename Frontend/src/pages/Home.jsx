import React from 'react'; 
import TopGetStartedSection from '../components/TopGetStartedSection';
import BottomFeatureSection from '../components/BottomFeatureSection';
import ShortPricing from '../components/ShortPricing';
import TransactionHistory from '../components/TransactionHistory';

const Home = () => {
  

  return (
    <div className=" flex flex-col text-white px-0 py-0">

        <main className="max-w-[95vw] lg:max-w-[85vw] w-full h-fit mb-4 xl:mb-0  
        
        
               mx-auto flex flex-col items-start mt-4 xl:mt-6 gap-4 xl:gap-6 2xl:mt-10">

          
<div className="w-full h-fit flex flex-col xl:flex xl:flex-row items-center justify-start gap-4 xl:gap-6 2xl:gap-10">  
  <div className="w-full h-fit flex flex-col items-start gap-4 xl:gap-6 2xl:gap-10">
          <TopGetStartedSection />
          <BottomFeatureSection />
  </div>
  <div className="w-full h-fit flex flex-col items-start gap-4 xl:gap-6 2xl:gap-10"> 
    <ShortPricing />
    <TransactionHistory />

  </div>
</div>

        
          
        </main>

       </div>
       
  );
};

export default Home;
       
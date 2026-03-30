import { motion } from "framer-motion"
import React, { useState, useEffect} from "react"
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { serverUrl } from "../App";



const Pricing =  () => {
  const navigate = useNavigate();
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);


const handlePaying = async (amount) => {
  try{
    setPayingAmount(amount);
    setPaying(true);

    const result = await axios.post(serverUrl + "/api/payment/credit-order", { amount }, {
      withCredentials: true,
    });

    if(result.data.url){
      toast.loading('Redirecting to payment...');
      window.location.href = result.data.url;
    }

    setPaying(false);


  }
  catch(err){
    setPaying(false);
    console.error("Payment failed", err);
    const errorMsg = err.response?.data?.message || "Payment failed. Please try again.";
    toast.error(errorMsg);
  }
}


   return (
    <div className="text-white px-6 py-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 2xl:gap-10">
        <button 
               onClick={() => navigate('/authcomplete')}
               className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 px-3 py-6 rounded-lg hover:bg-white/10"
            >
               <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               </span>
               <span className="text-xl font-semibold hidden sm:inline \">Back</span>
            </button>
        
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="ai-h2 text-[28px] 2xl:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-500">
          Simple, one-time pricing
        </motion.h2>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-white/60 mt-px 2xl:mt-4 text-lg 2xl:text-xl text-center max-w-2xl">
          Pick a plan that fits your project — pay once, use forever.
        </motion.p>
        <div className="mx-auto grid grid-col lg:grid-cols-3 gap-px xl:gap-12 2xl:gap-6">

            <PricingCard onBuy={handlePaying} 
              title="Starter"
              price="₹50"
              amount={50}
              credits={100}
              description="Good for individuals experimenting with our tools"
              features={[
                '100 credits',
                'Basic Features', 
                'Per note one time download',
                'Email Support'
              ]}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              paying={paying}
              payingAmount={payingAmount}
              
            />


            <PricingCard onBuy={handlePaying}
              popular
              title="Intermediate"
              price="₹100"
              amount={100}
              credits={300}
              description="Popular choice for internal or mid terms and regular workflows"
              features={[
                '300 credits',
                'Everything in Starter',
                'Per note 3 times download',
                'Email Support'
              ]}
              selectedPrice={selectedPrice} 
              setSelectedPrice={setSelectedPrice}
              paying={paying}
              payingAmount={payingAmount}
            />

            <PricingCard onBuy={handlePaying}
              title="Pro"
              price="₹150"
              amount={150}
              credits={550}
              description="Best for externals/final exams and last minute revisions."
              features={[
                '550 credits',
                'All Features',
                'Unlimited Pdf Download',
                'Pro Badge',
                'Email & Priority Support'
              ]}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              paying={paying}
              payingAmount={payingAmount}
            />


        </div>
      </div>
      </div>
   )
}

const PricingCard = ({
  popular,
  title,
  price,
  amount,
  credits,
  description,
  features,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
})=>{

  const isSelected = selectedPrice === amount ;
  const isPayingThisCard = paying && payingAmount === amount;

  return (

    <motion.div

    onClick={() => setSelectedPrice(amount)}
    whileHover={{y:-4 , scale :1.07}}
    transition={{duration:0.3}}
    className={`
      bg-white/5 backdrop-blur-2xl border rounded-[30px] p-6 flex flex-col mt-16 cursor-pointer relative
      ${isSelected 
        ? "border-green-500 bg-green-500/10" 
        : popular 
        ? "border-pink-500 bg-pink-500/10 scale-105" 
        : "border-white/10"}
      `}
   
    >
      {popular && 
      !isSelected && 
      <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded bg-pink-500 text-white font-semibold">
        Popular
      </span>
      }

      {isSelected && 
      <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded bg-green-500 text-white font-semibold">
        Selected
      </span>
      }

      <h2 className="ai-h2 text-2xl font-semibold">{title}</h2>
      <p className="text-white/60 mt-2">{description}</p>
      <div className="mt-4 flex flex-col items-baseline ">
        <p className="text-3xl font-extrabold">₹{amount}</p>
        <p className="text-sm text-white/90">{credits} Credits</p>
      </div>

      <div className="w-full bg-linear-to-r from-transparent via-while/90 to-transparent"/>

      <ul className="mt-4 flex flex-col gap-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-white/90">
            <span className="p-1 rounded-full bg-green-500/90">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 5L4.5 8L11 1"/></svg>
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button
    onClick = {(e)=>{
      e.preventDefault();
      onBuy(amount);
      
  }}
        
        disabled={isPayingThisCard}
        className={`
          mt-6 w-full py-2 border-2 rounded-lg font-semibold transition-all
          ${isSelected 
        ? "border-green-500/50 bg-green-500" 
        : popular 
        ? "border-pink-500/50 bg-pink-500"  
        : "border-white/50 bg-white text-transparent bg-clip-text bg-linear-to-r from-white/80 to-white/20"}
          
        `}
      >
        {paying && isPayingThisCard ? "Processing..." : "Buy Now"}
      </button>
  </motion.div>
  )
 

}

export default Pricing


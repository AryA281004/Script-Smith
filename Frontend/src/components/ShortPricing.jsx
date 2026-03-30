import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const Check = ({ className = "w-5 h-5 text-white" }) => (
<svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
strokeWidth={3}
stroke="currentColor"
className={className}

>

```
<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
```

  </svg>
)

export default function PricingSlider() {
const [index, setIndex] = useState(0)
const navigate = useNavigate()

const handleGoToPricingPage = () => {
navigate("/pricing")
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 50,
    desc: 'Good for individuals experimenting with our tools',
    features: ['100 credits','Basic Features', 'Per note one time download','Email Support'],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    price: 100,
    desc: 'Popular choice for small teams and regular workflows',
    recommended: true,
    features: ['300 credits','Everything in Starter', 'Per note 3 times download','Email Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 150,
    desc: 'For larger orgs, custom integrations and SLA',
    features: ['550 credits','All Features', 'Unlimited Pdf Download',"Email & Priority Support " ],
  },
]

const plan = plans[index]

const next = () =>
setIndex((prev) => (prev + 1) % plans.length)

const prev = () =>
setIndex((prev) => (prev - 1 + plans.length) % plans.length)

return ( <div className="text-white flex flex-col items-center justify-self-start justify-center gap-1">


  <div className="flex items-center gap-2">

    <button
      onClick={prev}
      className="text-white/60 hover:text-white text-2xl"
    >
      ←
    </button>

    <div className="w-78 xl:w-60 2xl:w-72 h-110 xl:h-83 2xl:h-110 relative">

      <AnimatePresence mode="wait">
        <motion.section
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="
            rounded-[30px] 2xl:rounded-[40px] relative overflow-hidden px-6 py-4 xl:px-4 xl:py-3 2xl:px-6 2xl:py-4
            backdrop-blur-xl border border-white/40
            bg-linear-to-br from-white/5 via-transparent to-transparent
            flex flex-col gap-3 xl:gap-1.5 2xl:gap-3
            min-h-95 xl:min-h-82 
          "
        >
          <h3 className="text-white text-lg xl:text-[20px] 2xl-lg font-semibold">
            {plan.name}
          </h3>

          <p className="text-white/60 text-sm">{plan.desc}</p>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{plan.price}</span>
            <span className="text-sm text-white/70">
              /credit
            </span>
          </div>

          <ul className="flex flex-col gap-3 xl:gap-1 2xl:gap-3 mt-2 xl:mt-px 2xl:mt-2">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 xl:gap-1 2xl:gap-2 text-sm text-white/90">
                <span className="p-1 xl:p-px 2xl:p-1 rounded-full bg-green-500/90">
                  <Check className="w-4 xl:w-2 2xl:w-4 h-4 xl:h-2 2xl:h-4 text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleGoToPricingPage}
            className="
              mt-4 xl:mt-1 2xl:mt-4 w-full font-semibold py-2 rounded-lg transition-all
              bg-white text-gray-900
            "
          >
            See full details
          </button>

          <p className="text-xs text-white/60 mt-2">
            Buy credits anytime.
          </p>

        </motion.section>
      </AnimatePresence>

    </div>

    <button
      onClick={next}
      className="text-white/60 hover:text-white text-2xl"
    >
      →
    </button>

  </div>

  <div className="flex gap-2">
    {plans.map((_, i) => (
      <div
        key={i}
        onClick={() => setIndex(i)}
        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
          i === index ? "bg-white w-6" : "bg-white/30"
        }`}
      />
    ))}
  </div>

</div>


)
}

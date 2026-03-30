import React from 'react'

const TransactionHistory = () => {
  return (
    
      <section
            className="w-full 2xl:w-[18vw] 
        min-h-61.5 xl:min-h-63.5 2xl:min-h-61.5
        rounded-[50px] 
        relative overflow-hidden   px-6 
                             bg-radial backdrop-blur-xl
                             border border-white/50
                             transition-all duration-500 
              
              
                             before:absolute before:inset-0 before:rounded-[50px] 
                             before:bg-linear-to-br before:from-white/50 before:via-transparent 
                             before:to-transparent before:opacity-60 before:pointer-events-none 
                             
                             after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
                             after:from-white/20 after:via-transparent after:to-transparent 
                             after:opacity-40 after:pointer-events-none
       
        flex flex-col items-center"
          >
            <div className=" flex justify-center items-center mt-4 " >
                <h2 className="ai-h2 text-2xl tracking-[0.02em] text-white">
                    Transaction History
                    </h2>
            </div>
            <div className="w-full h-0.5 bg-linear-to-r from-transparent via-white to-transparent mt-0.5 opacity-100" />
            <div> 
                <p className="text-white/70 text-sm mt-4">No transactions yet.</p>
            </div>

          </section>
  )
}

export default TransactionHistory

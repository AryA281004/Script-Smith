import React from 'react'
import { motion } from "framer-motion";
import Navbarafterauth from '../components/Navbarafterauth';
import FormForNoteGenerate from '../components/FormForNoteGenerate';
import FormResult from '../components/FormResult';
import Sidebar from '../components/Sidebar';

const Forgenotes = () => {
  const [loading, setLoading] = React.useState(false);
  const[results, setResults] = React.useState(null);
  const [error , setError] = React.useState(null);

  return (
    <div className="flex flex-col text-white px-0 py-0">
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col xl:flex-row items-start gap-4 xl:gap-10"
      >
        
        {!results && <FormForNoteGenerate loading={loading} setResults={setResults} setLoading={setLoading} setError={setError} />}
        {results && <Sidebar results={results} setResults={setResults} />}
        <FormResult
          topic={results?.topic || ''}
          // backend may return the generated text under different keys (notes, raw, content)
          // prefer `notes`, then `content`, then `raw` to maximize compatibility
          content={results?.notes || results?.content || results?.raw || ''}
          results={results}
          loading={loading}
          onBack={() => setResults(null)}
        />



      </motion.div>
      
    </div>
  )
}

export default Forgenotes
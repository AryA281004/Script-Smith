import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store'
import { Provider } from 'react-redux'

// Suppress noisy extension-related unhandled promise rejection errors that
// originate from browser extensions (e.g. "Could not establish connection. Receiving end does not exist.").
// This is a defensive, minimal workaround so the console is not flooded in development.
window.addEventListener('unhandledrejection', (event) => {
  try {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (/Could not establish connection\. Receiving end does not exist\./.test(msg)) {
      // prevent the error from being treated as uncaught in the console
      event.preventDefault();
    }
  } catch (e) {
    // swallow any unexpected errors in the handler itself
  }
});

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <Provider store={store}>
       <App />
    </Provider>
    </BrowserRouter>
  
  
)

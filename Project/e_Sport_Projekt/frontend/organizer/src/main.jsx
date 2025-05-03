import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  
  //Ha kivesszük a StrictMode-ot, akkor a fetch-ek nem fognak kétszer lefutni
  <App />
)

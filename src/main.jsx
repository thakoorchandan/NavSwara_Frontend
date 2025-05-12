import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import ShopContextProvider from './context/shopcontext.jsx'
import "antd/dist/reset.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <ShopContextProvider>
    <App/>
  </ShopContextProvider>
    
  </BrowserRouter>
  </StrictMode>,
)

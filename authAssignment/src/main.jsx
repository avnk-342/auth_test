import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login_Page from './Page/Login_Page';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId ={import.meta.env.VITE_API_KEY}>
      < Login_Page />
    </GoogleOAuthProvider>
  </StrictMode>,
)

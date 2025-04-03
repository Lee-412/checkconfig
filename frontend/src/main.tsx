import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>

        <SidebarProvider>

          <App />

        </SidebarProvider>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)

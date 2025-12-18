import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from 'sonner'
import { useLoadUserQuery } from './features/api/authapi'
import LoadingSpinner from './components/LoadingSpinner'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (
    <>
      {
        isLoading ? (
          <div className="flex items-center justify-center p-4">
            <h1 className="text-lg font-semibold"><LoadingSpinner /></h1>
          </div>
        ) : (
          <>{children}</>
        )
      }
    </>
  )

}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
      </Custom>
      <Toaster />
    </Provider>
  </StrictMode>,
)

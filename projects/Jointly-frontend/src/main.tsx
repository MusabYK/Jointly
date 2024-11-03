import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Account from './Account'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import './styles/main.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'account/',
    element: <Account />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* <Navbar /> */}
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
)

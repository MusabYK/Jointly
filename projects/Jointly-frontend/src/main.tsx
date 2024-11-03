import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/main.css'
// import Navbar from './components/Navbar'
// import Account from './Account'
// import CreateAccount from './CreateAccount'
// import Dashboard from './CreateAccount'
// import Contract from './Contract'
// import N from './components/Navbar'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App/>
//   },
//   {
//     path: 'account/',
//     element: <Account/>
//   },
//   {
//     path: 'dashboard/',
//     element: <Dashboard/>
//   }
// ])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
)

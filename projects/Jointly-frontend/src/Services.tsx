import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center bg-no-repeat bg-opacity-50"
     style={{ 
      background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%), url("/blockchain.jpg")',  
      backgroundSize:'cover',
      backgroundPosition: 'center'
      }}>
      <Navbar/>
      {/* Hero Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-400 text-xl">Empowering decentralized governance through blockchain technology</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Service Card 1 */}
          <div className="bg-gray-700/50 backdrop-blur-sm hover:backdrop-blur-md  rounded-xl p-6 hover:bg-gray-600 transition duration-300">
            <div className="h-12 w-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">DAO Management</h3>
            <p className="text-gray-400">Create and manage decentralized autonomous organizations with ease using our smart contract infrastructure.</p>
          </div>

          {/* Service Card 2 */}
          <div className="bg-gray-700/50 backdrop-blur-sm hover:backdrop-blur-md  rounded-xl p-6 hover:bg-gray-600 transition duration-300">
            <div className="h-12 w-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure Voting</h3>
            <p className="text-gray-400">Implement transparent and secure voting mechanisms for your organization's decision-making process.</p>
          </div>

          {/* Service Card 3 */}
          <div className="bg-gray-700/50 backdrop-blur-sm hover:backdrop-blur-md  rounded-xl p-6 hover:bg-gray-600 transition duration-300">
            <div className="h-12 w-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Proposal Management</h3>
            <p className="text-gray-400">Create, track, and execute proposals with our comprehensive proposal management system.</p>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-700/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Decentralized Governance</h3>
                <p className="mt-2 text-gray-400">Ensure fair and transparent decision-making through blockchain-based voting.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Smart Contract Security</h3>
                <p className="mt-2 text-gray-400">Built on secure smart contracts with automated execution of approved proposals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Services
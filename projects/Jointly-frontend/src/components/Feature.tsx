import React from 'react'

const Feature = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="bg-gray-800 p-8 rounded-xl hover:transform hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-white mb-4">Secure Voting</h3>
          <p className="text-gray-400">Implement democratic decision-making with our secure voting system</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-xl hover:transform hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-white mb-4">Multi-sig Control</h3>
          <p className="text-gray-400">Multiple signatures required for enhanced security</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-xl hover:transform hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-white mb-4">Transparent Operations</h3>
          <p className="text-gray-400">All transactions and votes are recorded on the blockchain</p>
        </div>
  </div>
  )
}

export default Feature
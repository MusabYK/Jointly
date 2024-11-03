import { motion } from 'framer-motion'
import React from 'react'

interface AnimatedWalletButtonProps {
  onClick: () => void
}

const AnimatedWalletButton: React.FC<AnimatedWalletButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      data-test-id="connect-wallet"
      className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-700"
      onClick={onClick}
      whileHover={{ scale: 1.05, borderColor: 'rgb(107, 114, 128)' }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
        initial={{ x: '100%', scale: 0.1 }}
        whileHover={{ x: 0, scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="relative z-10 flex items-center space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span>Connect Wallet</span>
      </motion.div>
    </motion.button>
  )
}

export default AnimatedWalletButton

// Usage example:
export function WalletConnectionSection() {
  const toggleWalletModal = () => {
    // Your wallet connection logic here
    console.log("Toggling wallet modal")
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <AnimatedWalletButton onClick={toggleWalletModal} />
    </div>
  )
}

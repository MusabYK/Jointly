import React, { useState } from 'react'
import { AnimatedModalDemo } from './ModalButton'
import { AlignJustify, WalletMinimal, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import AnimatedWalletButton from './ScaleBtn'

interface LinkProps {
  id: number
  name: string
  url: string
}

const links: LinkProps[] = [
  {
    id: 1,
    name: 'Home',
    url: '/'
  },
  {
    id: 2,
    name: 'Services',
    url: 'services/'
  },
  {
    id: 3,
    name: 'About',
    url: '/'
  },
]


const Navbar = () => {
  const [showSide, setShowSide] = useState<boolean>(false)

  const sidebarVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className='flex items-center justify-between mx-auto bg-black/80 py-2 px-[5%]'>
      <a href='/' className='text-2xl flex items-center font-bold text-white'>
        <div className='text-3xl me-2 hover:animate-bounce transition-all ease-in duration-100'>
          <WalletMinimal />
        </div>
        JOINTLY
      </a>
      <div className='space-x-5 hidden md:flex'>
        {links.map(link => (
          <a
            className='text-white hover:animate-pulse'
            key={link.id}
            href={link.url}
          >
            {link.name}
          </a>
        ))}
      </div>
      <AnimatePresence>
        {showSide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-10"
              onClick={() => setShowSide(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='gap-4 px-5 flex fixed top-0 right-0 flex-col bg-black w-full sm:w-[50%] z-20 h-screen'
            >
              <motion.div
                variants={itemVariants}
                className='self-end mt-2'
                onClick={() => setShowSide(false)}
              >
                <X className='text-white cursor-pointer' />
              </motion.div>
              {links.map(link => (
                <motion.a
                  variants={itemVariants}
                  className='text-white text-lg'
                  key={link.id}
                  href={link.url}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div variants={itemVariants} className='self-start'>
                <AnimatedModalDemo/>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <button
        className='lg:hidden text-white'
        onClick={() => setShowSide(isShow => !isShow)}
      >
        <AlignJustify size={35} />
      </button>
      <div className='hidden lg:block'>
        <AnimatedModalDemo/>
        {/* <AnimatedWalletButton onClick={toggleWalletModal} /> */}
      </div>
    </div>
  )
}

export default Navbar

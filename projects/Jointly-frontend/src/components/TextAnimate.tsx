import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Word {
  text: string
  className: string
}

const words: Word[] = [
  {
    text: "Financial",
    className: "text-white",
  },
  {
    text: "inclusion",
    className: "text-white",
  },
  {
    text: "is not just",
    className: "text-white",
  },
  {
    text: "a possibility,",
    className: "text-white",
  },
  {
    text: "But a reality.",
    className: "text-blue-500",
  },
]

const TypewriterEffect: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [displayedWords, setDisplayedWords] = useState<Word[]>([])

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const word = words[currentWordIndex]
      const timer = setTimeout(() => {
        if (currentCharIndex < word.text.length) {
          setCurrentCharIndex(currentCharIndex + 1)
        } else {
          setDisplayedWords([...displayedWords, word])
          setCurrentWordIndex(currentWordIndex + 1)
          setCurrentCharIndex(0)
        }
      }, 100) // Adjust this value to change typing speed

      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, currentCharIndex, displayedWords])

  return (
    <div className="flex flex-wrap justify-center">
      <AnimatePresence>
        {displayedWords.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${word.className} mr-2 text-2xl sm:text-4xl md:text-5xl font-bold`}
          >
            {word.text}
          </motion.span>
        ))}
      </AnimatePresence>
      {currentWordIndex < words.length && (
        <span className={`${words[currentWordIndex].className} text-2xl sm:text-4xl md:text-5xl font-bold`}>
          {words[currentWordIndex].text.slice(0, currentCharIndex)}
        </span>
      )}
    </div>
  )
}

export function TextAnimate() {
  return (
    <div className="flex flex-col items-center justify-center h-[10rem]">
      <p className="text-neutral-100 text-xs sm:text-base mb-4">
        Algorand Block-chain
      </p>
      <TypewriterEffect />
    </div>
  )
}

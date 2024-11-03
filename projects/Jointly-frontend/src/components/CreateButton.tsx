import React from 'react'

const CreateButton = ({text}:{text:string}) => {
  return (
    <div>
      <a href="#_" className="relative inline-flex items-center justify-center px-6 py-3 font-medium text-white transition duration-300 ease-out bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 group">
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-50 bg-gradient-to-b from-white/10 to-transparent"></span>
        <span className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>{text}</span>
        </span>
        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-white/20 group-hover:h-full"></span>
      </a>
    </div>
  )
}

export default CreateButton

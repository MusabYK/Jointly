import { Search } from 'lucide-react'
import React from 'react'
import SearchButton from './components/CreateButton'
import CreateButton from './components/CreateButton'
import Navbar from './components/Navbar'

const Account = () => {
  return (
    <div className='bg-black/20'>
      <Navbar/>
      <div className="h-[40vh] flex flex-col justify-center bg-cover bg-center bg-no-repeat relative" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('public/coverme.jpg')`
      }}>
          <div className='space-y-4 w-[95%] md:w-[90%] mx-auto'>
            <h2 className="text-white text-2xl font-medium">Jointly Join Account</h2>
            <h1 className="text-white  text-4xl xl:text-5xl  font-bold mt-2">Participate in decision making</h1>
            <p className="text-gray-300  lg:text-lg mt-4">Join our decentralized community where every voice matters. Participate in key decisions, vote on proposals, and help shape the future of our DAO. Together, we can create meaningful change through collaborative governance.</p>
          </div>
      </div>
      <div className='w-[95%] md:w-[90%] mx-auto py-5 bg-black/0'>
        <div className='flex justify-between items-center my-2'>
        <div className='flex space-x-4'>
          <a href="#" className='text-white ring-1 py-2 px-3 lg:py-3 lg:px-5 rounded-full hover:bg-purple-500 bg-purple-700 ring-purple-500'>All</a>
          <a href="#" className='text-white ring-1 py-2 px-3 lg:py-3 lg:px-5 rounded-full hover:bg-purple-500 ring-purple-500'>In Progress</a>
          <a href="#" className='text-white ring-1 py-2 px-3 lg:py-3 lg:px-5 rounded-full hover:bg-purple-500 ring-purple-500'>Approved</a>
          <a href="#" className='text-white ring-1 py-2 px-3 lg:py-3 lg:px-5 rounded-full hover:bg-purple-500 ring-purple-500'>Denied</a>
        </div>
        <div className="flex space-x-5 items-center">
          <div className='flex items-center ring-1 ring-purple-600 px-4 rounded-full'>
            <Search className='text-white'/>
          <input type="search" className='p-2 lg:p-3 bg-transparent text-white outline-none' placeholder='Search Proposal'/>
          </div>
          <CreateButton text='Create Proposal'/>
        </div>
        </div>

          <div className='grid sm:grid-cols-2 py-3 lg:grid-cols-3 gap-4'>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-orange-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-orange-600/80 to-orange-300/80 p-2 rounded-md'>
                  <h2>Active</h2>
                  <span>Sat Nov 09 2024</span>
                </div>
                <div className='space-y-2'>
                  <h1>Algorand Nigeria Hackathon Taraba</h1>
                  <span>Voting Tag: #2343053593</span>
                  <p className='font-thin'>
                    Should we host our IRL event in Taraba to conclude the ongoing Algorand Regional Hackathon going on in Nigeria?
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes(100%)</span> <span>No(0%)</span></div>
                  <div className='bg-green-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes</span></div>
                </div>
              </div>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-green-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-green-600/80 to-green-300/80 p-2 rounded-md'>
                  <h2>Active</h2>
                  <span>Sat Nov 09 2024</span>
                </div>
                <div className='space-y-2'>
                  <h1>Algorand Nigeria Hackathon Taraba</h1>
                  <span>Voting Tag: #2343053593</span>
                  <p className='font-thin'>
                    Should we host our IRL event in Taraba to conclude the ongoing Algorand Regional Hackathon going on in Nigeria?
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes(100%)</span> <span>No(0%)</span></div>
                  <div className='bg-green-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes</span></div>
                </div>
              </div>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-red-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-red-600/80 to-red-300/80 p-2 rounded-md'>
                  <h2>Active</h2>
                  <span>Sat Nov 09 2024</span>
                </div>
                <div className='space-y-2'>
                  <h1>Algorand Nigeria Hackathon Taraba</h1>
                  <span>Voting Tag: #2343053593</span>
                  <p className='font-thin'>
                    Should we host our IRL event in Taraba to conclude the ongoing Algorand Regional Hackathon going on in Nigeria?
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes(100%)</span> <span>No(0%)</span></div>
                  <div className='bg-green-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes</span></div>
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Account

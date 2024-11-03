import { Search } from 'lucide-react'
// import React from 'react'
import SearchButton from './components/CreateButton'
import CreateButton from './components/CreateButton'

// src/components/Home.tsx
import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { decodeUint64, encodeAddress, encodeUint64 } from 'algosdk'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import MethodCall from './components/MethodCall'
import Proposal from './components/Proposal'
import { JointlyClient } from './contracts/Jointly'
import * as methods from './methods'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

let proposalList: Proposal[] = []

interface Proposal {
  totalVotes: number
  votesInFavor: number
  votesAgainst: number
  executed: number
  proposerAddress: string
  proposerName: string
  proposal: string
}

const Account = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [appId, setAppId] = useState<number>(0)
  const [useStateCounter, setUseState] = useState<number>(0)

  const [creator, setCreator] = useState<string | undefined>(undefined)

  const [memberAddress, setMember] = useState<string | undefined>(undefined)
  const [memberName, setMemberName] = useState<string | undefined>(undefined)
  const [proposal, setProposal] = useState<string | undefined>(undefined)

  // Global state variables
  const [counter, setCounter] = useState<number>(0)
  const [currentProposal, setCurrentProposal] = useState<string>('')
  const [currentProposerName, setCurrentProposer] = useState<string>('')
  const [currentTotalVote, setCurrentTotalVote] = useState<bigint>(0n)
  const [currentVotesInFavor, setCurrentVotesInFavor] = useState<bigint>(0n)
  const [currentVotesAgainst, setCurrentVotesAgainst] = useState<bigint>(0n)
  const [currentExecuted, setCurrentExecuted] = useState<boolean>(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // activeAdress is the adress of the connected user (buyer or seller) in a wallet
  const { activeAddress, signer } = useWallet() // useWallet is for integrating many diff wallet providers in an app

  const fetchProposalBoxes = async () => {
    setLoading(true)
    setError(null)
    try {
      proposalList = []
      for (let index = 1; index <= counter; index++) {
        const proposalObject: Proposal = {
          totalVotes: 0,
          votesInFavor: 0,
          votesAgainst: 0,
          executed: 0,
          proposerAddress: '',
          proposerName: '',
          proposal: '',
        }
        console.log('Getting Proposal Box Content')
        const boxContent = await appClient.appClient.getBoxValue(encodeUint64(index))

        const decoder = new TextDecoder()
        console.log(boxContent)
        // Extract the values from the boxContent and assign them to the proposalObject properties
        proposalObject.totalVotes = decodeUint64(boxContent.slice(0, 8), 'safe')
        proposalObject.votesInFavor = decodeUint64(boxContent.slice(8, 16), 'safe')
        proposalObject.votesAgainst = decodeUint64(boxContent.slice(16, 24), 'safe')
        proposalObject.executed = decodeUint64(boxContent.slice(24, 32), 'safe')
        proposalObject.proposerAddress = encodeAddress(boxContent.slice(32, 64))
        proposalObject.proposerName = decoder.decode(boxContent.slice(64, 114))
        proposalObject.proposal = decoder.decode(boxContent.slice(114, 164))

        proposalList.push(proposalObject)
      }

      // Set the listings data to state
      // setListings(fetchedListings)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    appClient
      .getGlobalState()
      .then((globalState) => {
        const id = globalState.registeredAssetCreated?.asBigInt() || 0n
        setCounter(globalState.counter?.asNumber || 0)
        setCurrentProposal(globalState.proposal?.asString()!)
        setCurrentProposer(globalState.proposerName?.asString()!)
        setCurrentTotalVote(globalState.totalVote?.asBigInt!)
        setCurrentVotesInFavor(globalState.votesInFavor?.asBigInt()!)
        setCurrentVotesAgainst(globalState.votesAgainst?.asBigInt!)
        setCurrentExecuted(Boolean(globalState.executed!))
        console.log('status:', currentExecuted)
      })
      .catch(() => {
        // setAppId(0)
      })

    fetchProposalBoxes()

    algorand.client.algod
      .getApplicationByID(appId)
      .do()
      .then((response) => {
        setCreator(response.params.creator)
      })
      .catch(() => {
        setCreator(undefined)
      })
  }, [appId])

  const algodConfig = getAlgodConfigFromViteEnvironment() //this get the environment (localNet, testNet, mainNet) from .env file
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  // after config then set a defaultsigner to our signer from use  wallet
  algorand.setDefaultSigner(signer)

  const appClient = new JointlyClient(
    {
      resolveBy: 'id',
      id: appId,
      sender: { addr: activeAddress!, signer },
    },
    algorand.client.algod,
  )

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }
  return (
    <div className='bg-black/20'>
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
          <input type="text" placeholder='Set proposal' className="input input-bordered" maxLength={1000} onChange={(e) => setProposal(e.currentTarget.value)} />
          <MethodCall methodFunction={methods.setProposal(algorand, appClient, activeAddress!, proposal!)} text={`Create proposal`} />
          {/* <CreateButton text='Create Proposal'/> */}
        </div>
        </div>
          <div className='grid sm:grid-cols-2 py-3 lg:grid-cols-3 gap-4'>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-blue-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-blue-600/80 to-blue-300/80 p-2 rounded-md'>
                  <h2>Ongoing</h2>
                  <span>Sat Nov 09 2024</span>
                </div>
                <div className='space-y-2'>
                  <span>Voting Tag: {counter}</span>
                  <h1 className='font-bold text-2xl'>Art Collection Transfer</h1>
                  <p className='font-thin'>
                  Proposal to transfer a set of 3 paintings from the company’s art collection to the new regional office for decoration purposes.
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes {currentVotesInFavor+""}</span> <span>No {currentVotesAgainst+""}</span></div>
                  <div className='bg-blue-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes {currentTotalVote+""}</span></div>
                </div>
              </div>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-green-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-green-600/80 to-green-300/80 p-2 rounded-md'>
                  <h2>Approved</h2>
                  <span>Sat Nov 08 2024</span>
                </div>
                <div className='space-y-2'>
                  <span>Voting Tag: {counter}</span>
                  <h1 className='font-bold text-2xl'>Transfer of Flight Tickets</h1>
                  <p className='font-thin'>
                    Proposal to transfer a business class round-trip flight ticket to John Doe for attending the conference in Dubai. The ticket is booked for November 2024.
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes {currentVotesInFavor+""}</span> <span>No {currentVotesAgainst+""}</span></div>
                  <div className='bg-green-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes {currentTotalVote+""}</span></div>
                </div>
              </div>
              <div className='text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-red-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md'>
                <div className='flex justify-between items-center bg-gradient-to-r from-red-600/80 to-red-300/80 p-2 rounded-md'>
                  <h2>Decline</h2>
                  <span>Sat Nov 07 2024</span>
                </div>
                <div className='space-y-2'>
                  <span>Voting Tag: {counter}</span>
                  <h1 className='font-bold text-2xl'>Office Rent Payment</h1>
                  <p className='font-thin'>
                      Proposal to transfer 0.5 ETH from the joint account to the landlord for monthly office rent. Due date: 5th of the month.
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'><span>Yes {currentVotesInFavor+""}</span> <span>No {currentVotesAgainst+""}</span></div>
                  <div className='bg-red-600 h-3 rounded-md'></div>
                  <div><span>By NTCDMS..MM7ZAM</span> <span>Total Votes {currentTotalVote+""}</span></div>
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Account

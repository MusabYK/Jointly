// src/components/Home.tsx
import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { decodeUint64, encodeAddress, encodeUint64 } from 'algosdk'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import MethodCall from './components/MethodCall'
import ProposalComponent from './components/Proposal'
import { JointlyClient } from './contracts/Jointly'
import * as methods from './methods'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import { AlignJustify, Search, WalletMinimal, X } from 'lucide-react'
import { AnimatedModalDemo } from './components/ModalButton'
import { AnimatePresence, motion } from 'framer-motion'
import WalletConnect from './components/WalletButton'

interface HomeProps {}

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

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true }) // just like in testing

  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [appId, setAppId] = useState<number>(0)
  const [searchAppId, setSearchAppId] = useState<number>(0)
  const [state, setState] = useState<number>(0)

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
        proposalObject.proposerName = decoder.decode(boxContent.slice(70, 75))
        proposalObject.proposal = decoder.decode(boxContent.slice(77, 164));

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
  }, [state, appId])

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

  // Nav Stuff
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
      url: '/'
    },
    {
      id: 3,
      name: 'About',
      url: '/'
    },
  ]
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900/80 to-gray-800/80">
      {/* Nav Section */}
      (
    <div className='flex items-center justify-between mx-auto bg-black py-2 px-[5%]'>
      <a href='/' className='text-2xl flex items-center font-bold text-white'>
        <div className='text-3xl me-2 hover:animate-bounce transition-all ease-in duration-100'>
          <WalletMinimal />
        </div>
        JOINTLY
      </a>
      <div className='space-x-5 hidden md:flex'>
        {links.map(link => (
          <a
            className='text-white'
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
        <WalletConnect text='Wallet connection' onClick={toggleWalletModal} />
      </div>
    </div>
    <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
  )
      {/* Hero Section */}
      {activeAddress && appId === 0 && (
        <div>
          <div className="container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                Decentralized Joint Account Management
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Create and manage joint accounts on Algorand blockchain with advanced voting mechanisms and complete transparency
              </p>

              <div className="flex justify-center gap-6 mb-12">
              <input type="number" onChange={(e) => setSearchAppId(e.currentTarget.valueAsNumber || 0)} className='p-2 lg:p-3 bg-transparent ring-1 ring-white text-white' placeholder='Enter appID'/>
                <a
                  onClick={() => setAppId(searchAppId)}
                  href="#openAccount"
                  className="px-4 sm:px-8 py-3 text-sm sm:text-md bg-gradient-to-r from-purple-500 to-pink-500 rounded-full  text-white font-semibold hover:opacity-90 transition-all"
                  data-test-id="connect-wallet"
                >
                  Go To Account
                </a>
                <a
                  onClick={methods.createApp(appClient, setAppId)}
                  href="#createWallet"
                  className="px-4 sm:px-8 py-3 text-sm sm:text-md rounded-full ring-1 ring-white text-white hover:bg-white hover:text-pink-600 font-semibold hover:opacity-90 transition-all"
                  data-test-id="connect-wallet"
                >
                  Create account
                </a>
                {/* <MethodCall methodFunction={methods.createApp(appClient, setAppId)} text="Create contract" /> */}
              </div>
            </div>

            {/* Features Section */}
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

            {/* How It Works Section */}
            <div className="py-20">
              <h2 className="text-4xl font-bold text-center text-white mb-12">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center backdrop-blur-sm bg-slate-800/60 hover:bg-slate-800/40 transition-all ease-in-out duration-200 hover:translate-y-2 cursor-pointer p-4 rounded-md">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
                  <p className="text-gray-400">Link your Algorand wallet to get started</p>
                </div>
                <div className="text-center backdrop-blur-sm bg-slate-800/60 hover:bg-slate-800/40 transition-all ease-in-out duration-200 hover:translate-y-2 cursor-pointer p-4 rounded-md">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Create Account</h3>
                  <p className="text-gray-400">Set up your joint account with custom parameters</p>
                </div>
                <div className="text-center backdrop-blur-sm bg-slate-800/60 hover:bg-slate-800/40 transition-all ease-in-out duration-200 hover:translate-y-2 cursor-pointer p-4 rounded-md">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add Members</h3>
                  <p className="text-gray-400">Invite trusted parties to join your account</p>
                </div>
                <div className="text-center backdrop-blur-sm bg-slate-800/60 hover:bg-slate-800/40 transition-all ease-in-out duration-200 hover:translate-y-2 cursor-pointer p-4 rounded-md">
                  <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Managing</h3>
                  <p className="text-gray-400">Create proposals and vote on decisions</p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div
              className="py-20 bg-gray-800/50 rounded-3xl px-8 relative"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("/public/bg2.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-slate-700/50 backdrop-blur-sm hover:backdrop-blur-md  p-4 rounded-md">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Decentralized Control</h3>
                      <p className="text-gray-400">No single point of failure or control, truly democratic management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-slate-700/50 hover:backdrop-blur-md p-4 ">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Enhanced Security</h3>
                      <p className="text-gray-400">Multi-signature requirements and blockchain-based security</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-slate-700/50 hover:backdrop-blur-md p-4 rounded-md">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Complete Transparency</h3>
                      <p className="text-gray-400">All actions and votes are recorded on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-slate-700/50 hover:backdrop-blur-md p-4 rounded-md">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Fast & Efficient</h3>
                      <p className="text-gray-400">Quick proposal creation and voting process</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="bg-gray-900 py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 text-gray-400">
                <div>
                  <h4 className="text-white font-semibold mb-4">About Us</h4>
                  <p>Building the future of decentralized finance through innovative joint account management solutions.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="hover:text-purple-400">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-purple-400">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-purple-400">
                        Support
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="hover:text-purple-400">
                      Twitter
                    </a>
                    <a href="#" className="hover:text-purple-400">
                      Discord
                    </a>
                    <a href="#" className="hover:text-purple-400">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                <p>&copy; 2024 Jointly. All rights reserved.</p>
              </div>
            </div>
          </footer>
          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        </div>
      )}




      {/* Home section */}
      {activeAddress && appId !== 0 &&
      (
        <div className='bg-black/20'>
          <div className="h-[40vh] flex flex-col justify-center bg-cover bg-center bg-no-repeat relative" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('public/coverme.jpg')`
          }}>
              <div className='space-y-4 w-[95%] md:w-[90%] mx-auto'>
                <h1 className="text-white  text-4xl xl:text-5xl  font-bold mt-2">AppID: {appId}</h1>
                <input
                  type="number"
                  className="input input-bordered"
                  value={appId}
                  onChange={(e) => setAppId(e.currentTarget.valueAsNumber || 0)}
                />
                <h2 className="text-white text-2xl font-medium">Jointly Joint Account</h2>
                <h1 className="text-white  text-4xl xl:text-5xl  font-bold mt-2">Dangote Group Joint Account</h1>
                <p className="text-gray-300  lg:text-lg mt-4">Participate in key decisions, vote on proposals, and help shape the future of our DAO. Together, we can create meaningful change through collaborative governance.</p>
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
            {activeAddress === creator && appId !== 0 && (
              <div className="grid">
                <div className="divider" />
                <p className="font-bold text-center">Add member</p>
                <p>name</p>
                <input
                  type="text"
                  className="input input-bordered"
                  maxLength={1000}
                  onChange={(e) => setMemberName(e.currentTarget.value)}
                />
                <p>Address</p>
                <input type="text" className="input input-bordered" maxLength={58} onChange={(e) => setMember(e.currentTarget.value)} />
                <MethodCall
                  methodFunction={methods.addMember(algorand, appClient, memberAddress!, memberName!, activeAddress!, setSearchAppId)}
                  text={'Add member'}
                />
              </div>
            )}
            <div className="flex space-x-5 items-center">

              <input
                  type="text"
                  className="input input-bordered"
                  maxLength={1000}
                  onChange={(e) => setMemberName(e.currentTarget.value)}
                />
              <input type="text" placeholder='Set proposal' className="input input-bordered" maxLength={1000} onChange={(e) => setProposal(e.currentTarget.value)} />
              <MethodCall methodFunction={methods.setProposal(algorand, appClient, activeAddress!, memberName!, proposal!, setSearchAppId)} text={`Create proposal`} />
            </div>
            </div>
              <MethodCall methodFunction={methods.vote(appClient, false, activeAddress!, setSearchAppId)} text={`VOTE`} />
              <div className='grid sm:grid-cols-2 py-3 lg:grid-cols-3 gap-4'>
                <ProposalComponent proposal={currentProposal} proposerName={currentProposerName} counter={counter} totalVote={Number(currentTotalVote)} votesInFavor={Number(currentVotesInFavor)} votesAgainst={Number(currentVotesAgainst)} status={10}/>
                {proposalList.map((proposal, index) => (
                    <ProposalComponent proposal={proposal.proposal} proposerName={proposal.proposerName} counter={index} totalVote={proposal.totalVotes} votesInFavor={proposal.votesInFavor} votesAgainst={proposal.votesAgainst} status={proposal.executed}/>
                ))}
                <ProposalComponent proposal={"Sample proposal"} proposerName={"Sample proposer name"} counter={7777} totalVote={8} votesInFavor={5} votesAgainst={3} status={1}/>
              </div>
          </div>
        </div>
      )
      }
    </div>
  )
}

export default Home

// src/components/Home.tsx
import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import algosdk, { decodeUint64, encodeAddress, encodeUint64 } from 'algosdk'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import MethodCall from './components/MethodCall'
import { DaoAccountClient } from './contracts/DaoAccount'
import * as methods from './methods'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import { TextAnimate } from './components/TextAnimate'
import AnimatedWalletButton from './components/ScaleBtn'

interface HomeProps {}

const proposalList: Proposal[] = [];

interface Proposal {
  totalVotes: number;
  votesInFavor: number;
  votesAgainst: number;
  executed: number;
  proposerAddress: string;
  proposal: string;
}

const Home: React.FC<HomeProps> = () => {
  AlgokitConfig.configure({ populateAppCallResources: true })

  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [appId, setAppId] = useState<number>(0)
  const [assetId, setAssetId] = useState<bigint>(0n)
  const [creator, setCreator] = useState<string | undefined>(undefined)
  const [memberAddress, setMember] = useState<string | undefined>(undefined)
  const [memberName, setMemberName] = useState<string | undefined>(undefined)
  const [proposal, setProposal] = useState<string | undefined>(undefined)

  // Global state variables
  const [counter, setCounter] = useState<number>(0)
  const [currentProposal, setCurrentProposal] = useState<string>("")
  const [currentProposerName, setCurrentProposer] = useState<string>("")
  const [currentTotalVote, setCurrentTotalVote] = useState<bigint>(0n)
  const [currentVotesInFavor, setCurrentVotesInFavor] = useState<bigint>(0n)
  const [currentVotesAgainst, setCurrentVotesAgainst] = useState<bigint>(0n)
  const [currentExecuted, setCurrentExecuted] = useState<boolean>(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { activeAddress, signer } = useWallet()

  // ... keeping all the existing functions and useEffect ...
  const fetchProposalBoxes = async () => {
    // ... existing fetchProposalBoxes implementation ...
  }

  useEffect(() => {
    // ... existing useEffect implementation ...
  }, [appId])

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(signer)

  const dmClient = new DaoAccountClient(
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900/80 to-gray-800/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Decentralized Joint Account Management
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Create and manage joint accounts on Algorand blockchain with advanced voting mechanisms and complete transparency
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <a
              // onClick={toggleWalletModal}
              href='#createWallet'
              className="px-4 sm:px-8 py-3 text-sm sm:text-md bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:opacity-90 transition-all"
              data-test-id="connect-wallet"
            >
              Go To Account
            </a>
            <AnimatedWalletButton onClick={toggleWalletModal} />
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
        <div className="py-20 bg-gray-800/50 rounded-3xl px-8 relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("/public/bg2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
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
        {/* Create Joint account section */}
        {/* Main Interface */}
        {activeAddress && (
          <div id='createWallet' className="mt-20 bg-gray-800 rounded-2xl mx-auto w-fit p-8">
            {/* ... Rest of the interface code remains the same ... */}
            {appId === 0 ? (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Account</h2>
                <div className="space-y-4">
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                    value={appId}
                    onChange={(e) => setAppId(e.currentTarget.valueAsNumber || 0)}
                    placeholder="Enter App ID"
                  />
                  <MethodCall
                    methodFunction={methods.createApp(algorand, dmClient, activeAddress, 5n, setAppId)}
                    text="Create New Joint Account"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Account Management Section */}
                {activeAddress === creator && (
                  <div className="bg-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Account Management</h3>
                    <div className="grid gap-4">
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-600 rounded-lg text-white"
                        placeholder="Member Name"
                        onChange={(e) => setMemberName(e.currentTarget.value)}
                      />
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-600 rounded-lg text-white"
                        placeholder="Member Address"
                        onChange={(e) => setMember(e.currentTarget.value)}
                      />
                      <MethodCall
                        methodFunction={methods.addMember(algorand, dmClient, memberAddress!, memberName!, activeAddress!)}
                        text="Add Member"
                      />
                    </div>
                  </div>
                )}

                {/* Proposal Section */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create Proposal</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-600 rounded-lg text-white"
                      placeholder="Enter your proposal"
                      onChange={(e) => setProposal(e.currentTarget.value)}
                    />
                    <MethodCall
                      methodFunction={methods.setProposal(algorand, dmClient, activeAddress!, proposal!)}
                      text="Submit Proposal"
                    />
                  </div>
                </div>

                {/* Current Proposal Display */}
                {currentExecuted && (
                  <div className="bg-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Active Proposal</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-600 rounded-lg p-4">
                        <p className="text-white">{currentProposal}</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-400">Total Votes</p>
                            <p className="text-white font-bold">{String(currentTotalVote)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">In Favor</p>
                            <p className="text-white font-bold">{String(currentVotesInFavor)}</p>
                          </div>
                        </div>
                      </div>
                      <MethodCall
                        methodFunction={methods.vote(dmClient, false, activeAddress!)}
                        text="Cast Vote"
                      />
                    </div>
                  </div>
                )}

                {/* Proposal History */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Proposal History</h3>
                  <div className="space-y-4">
                    {proposalList.map((proposal, index) => (
                      <div key={index} className="bg-gray-600 rounded-lg p-4">
                        <p className="text-white mb-2">{proposal.proposal}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400">Total Votes</p>
                            <p className="text-white font-bold">{String(proposal.totalVotes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <p className="text-white font-bold">{String(proposal.executed)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {activeAddress === creator && (
                  <div className="text-center">
                    <MethodCall
                      methodFunction={methods.deleteApp(dmClient, setAppId)}
                      text="Delete Account"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
                <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400">FAQs</a></li>
                <li><a href="#" className="hover:text-purple-400">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-400">Twitter</a>
                <a href="#" className="hover:text-purple-400">Discord</a>
                <a href="#" className="hover:text-purple-400">GitHub</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 DAO Account. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default Home

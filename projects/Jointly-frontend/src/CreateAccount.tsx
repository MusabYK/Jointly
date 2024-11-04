import { Config as AlgokitConfig } from '@algorandfoundation/algokit-utils'
import AlgorandClient from '@algorandfoundation/algokit-utils/types/algorand-client'
import { useWallet } from '@txnlab/use-wallet'
import { decodeUint64, encodeAddress, encodeUint64 } from 'algosdk'
import { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import { JointlyClient } from './contracts/Jointly'
import * as methods from './methods'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

interface Proposal {
  totalVotes: number
  votesInFavor: number
  votesAgainst: number
  executed: number
  proposerAddress: string
  proposerName: string
  proposal: string
}

export default function CreateAccount() {
  AlgokitConfig.configure({ populateAppCallResources: true })

  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [appId, setAppId] = useState(0)
  const [searchAppId, setSearchAppId] = useState(0)
  const [creator, setCreator] = useState<string | undefined>(undefined)
  const [memberAddress, setMember] = useState('')
  const [memberName, setMemberName] = useState('')
  const [proposal, setProposal] = useState('')
  const [counter, setCounter] = useState(0)
  const [currentProposal, setCurrentProposal] = useState("")
  const [currentProposerName, setCurrentProposer] = useState("")
  const [currentTotalVote, setCurrentTotalVote] = useState(0n)
  const [currentVotesInFavor, setCurrentVotesInFavor] = useState(0n)
  const [currentVotesAgainst, setCurrentVotesAgainst] = useState(0n)
  const [currentExecuted, setCurrentExecuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proposalList, setProposalList] = useState<Proposal[]>([])
  const [activeTab, setActiveTab] = useState('connect')
  const [isProcessing, setIsProcessing] = useState(false)

  const { activeAddress, signer } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  algorand.setDefaultSigner(signer)

  const dmClient = new JointlyClient(
    {
      resolveBy: 'id',
      id: appId,
      sender: { addr: activeAddress!, signer },
    },
    algorand.client.algod,
  )

  const fetchProposalBoxes = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedProposals: Proposal[] = []
      for (let index = 1; index <= counter; index++) {
        const boxContent = await dmClient.appClient.getBoxValue(encodeUint64(index))
        const decoder = new TextDecoder()
        const proposalObject: Proposal = {
          totalVotes: decodeUint64(boxContent.slice(0, 8), 'safe'),
          votesInFavor: decodeUint64(boxContent.slice(8, 16), 'safe'),
          votesAgainst: decodeUint64(boxContent.slice(16, 24), 'safe'),
          executed: decodeUint64(boxContent.slice(24, 32), 'safe'),
          proposerAddress: encodeAddress(boxContent.slice(32, 64)),
          proposerName: decoder.decode(boxContent.slice(70, 75)),
          proposal: decoder.decode(boxContent.slice(76, 164)),
        }
        fetchedProposals.push(proposalObject)
      }
      setProposalList(fetchedProposals)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    dmClient.getGlobalState().then((globalState) => {
      setCounter(globalState.counter?.asNumber || 0)
      setCurrentProposal(globalState.proposal?.asString()!)
      setCurrentProposer(globalState.proposerName?.asString()!)
      setCurrentTotalVote(globalState.totalVote?.asBigInt!)
      setCurrentVotesInFavor(globalState.votesInFavor?.asBigInt()!)
      setCurrentVotesAgainst(globalState.votesAgainst?.asBigInt!)
      setCurrentExecuted(Boolean(globalState.executed!))
    }).catch(() => {})

    fetchProposalBoxes()

    algorand.client.algod.getApplicationByID(appId).do().then((response) => {
      setCreator(response.params.creator)
    }).catch(() => {
      setCreator(undefined)
    })
  }, [appId,searchAppId])

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)

  const handleAction = async (action: () => Promise<void>) => {
    setIsProcessing(true)
    try {
      await action()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href='/' className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                 Jointly Dashboard
                </a>
              </div>
            </div>
            <div className="flex items-center">
              {/* {activeTab === 'connect' && activeAddress && ( */}
              <div className='flex space-x-4 mr-3'>
              <div className='text-white'>
                Bal: <span>0.001</span>
              </div>
              <div className='text-white'>
                ASA: <span>0.00</span>
              </div>
              </div>

              {/* )} */}
              <button
                data-test-id="connect-wallet"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={toggleWalletModal}
              >
                {activeAddress ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center space-x-1 mb-8">
              {['connect', 'manage', 'propose', 'vote'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  disabled={tab !== 'connect' && (!activeAddress || (tab !== 'manage' && appId === 0))}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }
                    ${(tab !== 'connect' && (!activeAddress || (tab !== 'manage' && appId === 0)))
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === 'connect' && activeAddress && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">App ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={appId}
                    onChange={(e) => setAppId(e.currentTarget.valueAsNumber || 0)}
                  />

                  {appId === 0 && (
                    <button
                      className={`
                        mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600
                        text-white font-medium hover:from-blue-600 hover:to-purple-700
                        transition-all duration-200 shadow-lg hover:shadow-xl
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleAction(() => methods.createApp(dmClient, setAppId)())}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Create Contract'}
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'manage' && activeAddress === creator && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Member Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter member name"
                      maxLength={1000}
                      onChange={(e) => setMemberName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Member Address</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter member address"
                      maxLength={58}
                      onChange={(e) => setMember(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      className={`
                        flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600
                        text-white font-medium hover:from-blue-600 hover:to-purple-700
                        transition-all duration-200 shadow-lg hover:shadow-xl
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleAction(() => methods.addMember(algorand, dmClient, memberAddress!, memberName!, activeAddress!, setSearchAppId)())}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Add Member'}
                    </button>

                    <button
                      className={`
                        flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600
                        text-white font-medium hover:from-red-600 hover:to-pink-700
                        transition-all duration-200 shadow-lg hover:shadow-xl
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleAction(() => methods.deleteApp(dmClient, setAppId)())}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Delete App'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'propose' && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Proposal</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your proposal"
                    rows={4}
                    maxLength={1000}
                    onChange={(e) => setProposal(e.target.value)}
                  />

                  <button
                    className={`
                      mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600
                      text-white font-medium hover:from-blue-600 hover:to-purple-700
                      transition-all duration-200 shadow-lg hover:shadow-xl
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => handleAction(() => methods.setProposal(algorand, dmClient, activeAddress!, "propserName", proposal, setSearchAppId)())}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Submit Proposal'}
                  </button>
                </div>
              )}

              {activeTab === 'vote' && (
                <div className="space-y-6">
                  {currentProposal ? (
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4">Current Proposal</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-400">Proposal</span>
                          <span className="text-white">{currentProposal}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-400">Proposer</span>
                          <span className="text-white">{currentProposerName}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4">
                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-sm text-gray-400">Total Votes</div>
                            <div className="text-xl font-bold text-white">{currentTotalVote.toString()}</div>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-sm text-gray-400">In Favor</div>
                            <div className="text-xl font-bold text-green-500">{currentVotesInFavor.toString()}</div>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-sm text-gray-400">Against</div>
                            <div className="text-xl font-bold text-red-500">{currentVotesAgainst.toString()}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            currentExecuted
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {currentExecuted ? 'Executed' : 'Pending'}
                          </span>
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            className={`
                              px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600
                              text-white font-medium hover:from-red-600 hover:to-red-700
                              transition-all duration-200 shadow-lg hover:shadow-xl
                              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={() => handleAction(() => methods.vote(dmClient, false, activeAddress!, setSearchAppId)())}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Reject'}
                          </button>
                          <button
                            className={`
                              px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-lime-600
                              text-white font-medium hover:from-green-600 hover:to-lime-700
                              transition-all duration-200 shadow-lg hover:shadow-xl
                              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={() => handleAction(() => methods.vote(dmClient, true, activeAddress!, setSearchAppId)())}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Approve'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400">No active proposals</p>
                    </div>
                  )}

                  {proposalList.length > 0 && (
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4">Past Proposals</h3>

                      <div className="space-y-4">
                        {proposalList.map((proposal, index) => (
                          <div key={index} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-white font-medium">{proposal.proposal}</h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                proposal.executed
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {proposal.executed ? 'Executed' : 'Pending'}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">By {proposal.proposerName}</span>
                              <div className="space-x-4 text-gray-400">
                                <span>Total: {proposal.totalVotes}</span>
                                <span className="text-green-400">For: {proposal.votesInFavor}</span>
                                <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

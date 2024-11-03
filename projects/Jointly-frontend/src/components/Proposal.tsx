// this component (MethodCall) is used to call react method in our methods.ts file

interface ProposalInterface {
  proposal: string,
  proposerName: string,
  counter: number,
  totalVote: number,
  votesInFavor: number,
  votesAgainst: number,
  status: number,
}

const Proposal = ({ proposal, proposerName, counter, totalVote, votesInFavor, votesAgainst, status }: ProposalInterface) => {
  return (
    <div className="text-white bg-slate-600/40 backdrop-blur-md hover:backdrop-blur-xl hover:ring-1 ring-blue-500 duration-100 transition-all ease-in p-5 space-y-4 rounded-md">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600/80 to-blue-300/80 p-2 rounded-md">
        <h2>{status}</h2>
        <span>Sat Nov 09 2024</span>
      </div>
      <div className="space-y-2">
        <span>Voting Tag: {counter}</span>
        <h1 className="font-bold text-2xl">{proposerName}</h1>
        <p className="font-thin">
        {proposal + ''}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Yes {votesInFavor + ''}</span> <span>No {votesAgainst + ''}</span>
        </div>
        <div className="bg-blue-600 h-3 rounded-md"></div>
        <div>
          <span>Total Votes {totalVote + ''}</span>
        </div>
      </div>
    </div>
  )
}

export default Proposal

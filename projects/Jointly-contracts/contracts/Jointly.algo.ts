import { Contract } from '@algorandfoundation/tealscript';

// this variable or type which holds or describe the ID of member item in the BoxMap.
type member = { memberAddress: Address};
// every member is compose of information like the memberAdress, memberName,
type memberInfo = {
  memberAddress: Address;
  memberName: string;
};
// key -> value === (Address) -> (Address, string)
// === (32) -> (32 + 100) === 32 -> 132 === 164 B
// 2_500 + (400 * 164) === 68_100 microALGO === 0.0681 ALGO
// Per Box created = 0.0025 mAlgo -> Per byte in box created = 0.0004 mAlgo
const membersMbr = 2_500 + 400 * 164; // = 68,100 mbr amount that can hold the listing

type proposalKey = {key: uint64};
type proposalInfo = {
  totalVote: uint64;
  votesInFavor: uint64;
  votesAgainst: uint64;
  executed: uint64;
  proposerAddress: Address;
  proposerName:string,
  proposal: string;
};
// key -> value === (Address, uint64) -> (uint64, uint64, uint64, uint64, Address, string, string)
// === (8) -> (8 + 8 + 8 +8 +32 + 50 + 50) === 8 -> 164 === 172 B
// 2_500 + (400 * 164) === 68_100 microALGO === 0.0681 ALGO
// Per Box created = 0.0025 mAlgo -> Per byte in box created = 0.0004 mAlgo
const proposalMbr = 2_500 + 400 * 172; // = 71,300 mbr amount that can hold the listing

export class Jointly extends Contract {

  counter = GlobalStateKey<uint64>();
  registeredAssetCreated = GlobalStateKey<AssetID>();
  proposerAddress = GlobalStateKey<Address>();
  proposerName = GlobalStateKey<string>();
  proposal = GlobalStateKey<string>();
  totalVote = GlobalStateKey<uint64>();
  votesInFavor = GlobalStateKey<uint64>();
  votesAgainst = GlobalStateKey<uint64>();
  totalMembers = GlobalStateKey<uint64>();  // Total number of registered members
  executed = GlobalStateKey<boolean>();  // To track if current proposal is executed

  // memberListings which is a BoxMap, holds all the members Address for verification
  membersListings = BoxMap<member, memberInfo>();
  // proposalListings which is a BoxMap, holds all the members Address for verification
  proposalListings = BoxMap<proposalKey, proposalInfo>();

  createApplication(): void {
    this.totalMembers.value = 0;
    this.executed.value = false;
    this.counter.value = 1;
  }
  // this method authorize only the creator
  authorizeOnlyCreator(): void {
    assert(this.txn.sender == this.app.creator, 'you are not authorize(app creator)')
  }

  public addMember(mbrPay: PayTxn, memberAddress: Address, memberName: string) {
    this.authorizeOnlyCreator();
    assert(!this.membersListings({ memberAddress: memberAddress}).exists, 'Member already exist'); // making sure the member doesnt exist yet
    verifyPayTxn(mbrPay, {
      sender: this.app.creator,
      receiver: this.app.address,
      amount: membersMbr,
    });

    this.membersListings({ memberAddress: memberAddress}).value = {
      memberAddress: memberAddress,
      memberName: memberName,
    };
    this.totalMembers.value = this.totalMembers.value +1;
  }

  getAsset(): AssetID {
    return this.registeredAssetCreated.value;
  }

  setProposal(mbrPay: PayTxn, proposerAddress: Address, proposerName:string, proposal: string): void {
    assert(this.executed.value === false, "There is an ongoing proposal");
    assert(this.membersListings({ memberAddress: proposerAddress}).exists, 'Member does not exist');
    assert(!this.proposalListings({key:this.counter.value}).exists, 'Proposal already exist');
    this.proposerName.value = proposerName;
    this.proposal.value = proposal;
    this.totalVote.value = 0; // Reset votes
    this.votesInFavor.value = 0; // Reset in-favor votes
    this.votesAgainst.value = 0; // Reset against votes

    verifyPayTxn(mbrPay, {
      sender: this.app.creator,
      receiver: this.app.address,
      amount: proposalMbr,
    });

    this.proposalListings({key:this.counter.value}).value = {
      totalVote: 0,
      votesInFavor: 0,
      votesAgainst: 0,
      executed: 0,
      proposerAddress: proposerAddress,
      proposerName: proposerName,
      proposal: proposal,
    };
    this.executed.value = true; //execution status
  }

  vote(inFavor: boolean, memberAddress: Address): void {
    assert(this.membersListings({ memberAddress: memberAddress}).exists); // making sure the member doesnt exist yet
    assert(this.executed.value === true, "There is no ongoing proposal");

    this.totalVote.value = this.totalVote.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    } else {
      this.votesAgainst.value = this.votesAgainst.value + 1;
    }
    this.executeProposal();
  }
  // Execute proposal if the conditions are met (majority or all vote)
  private executeProposal(): void {
    let majorityRequired:uint64 = 1;
    if (this.totalMembers.value >= 2){
      majorityRequired = (this.totalMembers.value / 2);
    }

    if (this.votesInFavor.value >= majorityRequired && this.totalVote.value >= this.totalMembers.value) {
      const currentMemberAddress = this.proposalListings({key:this.counter.value}).value.proposerAddress;
      const currentProposerName = this.proposalListings({key:this.counter.value}).value.proposerName;
      const currentProposal = this.proposalListings({key:this.counter.value}).value.proposal;
      this.proposalListings({key:this.counter.value}).value = {
        totalVote: this.totalVote.value,
        votesInFavor: this.votesInFavor.value,
        votesAgainst: this.votesAgainst.value,
        executed: 1,
        proposerAddress: currentMemberAddress,
        proposerName: currentProposerName,
        proposal: currentProposal,
      };
      this.proposal.value = "";
      this.totalVote.value = 0;
      this.votesInFavor.value = 0;
      this.votesAgainst.value = 0;
      this.executed.value = false;
      this.counter.value = this.counter.value +1;
    } else if (this.votesInFavor.value < majorityRequired && this.totalVote.value >= this.totalMembers.value) {
      const currentProposerAddress = this.proposalListings({key:this.counter.value}).value.proposerAddress;
      const currentProposerName = this.proposalListings({key:this.counter.value}).value.proposerName;
      const currentProposal = this.proposalListings({key:this.counter.value}).value.proposal;
      this.proposalListings({key:this.counter.value}).value = {
        totalVote: this.totalVote.value,
        votesInFavor: this.votesInFavor.value,
        votesAgainst: this.votesAgainst.value,
        executed: 0,
        proposerAddress: currentProposerAddress,
        proposerName: currentProposerName,
        proposal: currentProposal,
      };
      this.proposal.value = "";
      this.totalVote.value = 0;
      this.votesInFavor.value = 0;
      this.votesAgainst.value = 0;
      this.executed.value = false;
      this.counter.value = this.counter.value +1;
    }else{
      // return 0;
    }
  }
}

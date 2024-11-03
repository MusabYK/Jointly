import * as algokit from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { JointlyClient } from './contracts/Jointly'

/**
 * Create the application and opt it into the desired/created asset
 */
export function createApp(
  appClient: JointlyClient,

  setAppId: (id: number) => void, // this will leter be a react use state function
) {
  return async () => {

    const createResult = await appClient.create.createApplication({totalMembers:0})

    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000)) // equivalent to 0.2 Algo

    console.log('App Created')
    setAppId(Number(createResult.appId))
  }
}

export function addMember(
  algorand: algokit.AlgorandClient,
  appClient: JointlyClient,
  memberAddress: string,
  memberName: string,
  creatorAddress: string,
  setSearchAppId: (id: number) => void, // this will leter be a react use state function
) {
  return async () => {
    const { appAddress } = await appClient.appClient.getAppReference()

    const mbrPay = await algorand.transactions.payment({
      sender: creatorAddress,
      receiver: appAddress,
      amount: microAlgos(68100),
    })

    const result = await appClient.addMember({ mbrPay: mbrPay, memberAddress: memberAddress, memberName: memberName })
    console.log('Member Added', result)
    setSearchAppId(1) // this will leter be a react use state function
  }
}
// {mbrPay:mbrPay, memberAddress:voterAcount2.addr, key:0, proposal:"I wish to win the algorand hackathon"}
export function setProposal(algorand: algokit.AlgorandClient,
  appClient: JointlyClient,
  memberAddress: string,
  proposerName:string,
  proposal: string,
  setSearchAppId: (id: number) => void, // this will leter be a react use state function
  ) {
  return async () => {
    const { appAddress } = await appClient.appClient.getAppReference()

    const mbrPay = await algorand.transactions.payment({
      sender: memberAddress,
      receiver: appAddress,
      amount: microAlgos(71300),
    })
    const result = await appClient.setProposal({ mbrPay: mbrPay, proposerAddress: memberAddress, proposerName: proposerName, proposal: proposal })
    setSearchAppId(2) // this will leter be a react use state function
  }
}

export function vote(
  appClient: JointlyClient,
  inFavor: boolean,
  memberAddress: string,
  setSearchAppId: (id: number) => void, // this will leter be a react use state function
  ) {
  return async () => {
    await appClient.vote({ inFavor: inFavor, memberAddress: memberAddress })
    console.log("Vote cast")
    setSearchAppId(3) // this will leter be a react use state function
  }
}
export function deleteApp(appClient: JointlyClient, setAppId: (id: number) => void) {
  return async () => {
    setAppId(0)
  }
}

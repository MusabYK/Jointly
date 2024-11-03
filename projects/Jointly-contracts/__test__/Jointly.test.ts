import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { JointlyClient } from '../contracts/clients/JointlyClient';
import algosdk, { encodeUint64 } from 'algosdk';
import {
  algos,
  getOrCreateKmdWalletAccount,
  microAlgos,
} from '@algorandfoundation/algokit-utils';
import { decodeUint64, encodeAddress } from 'algosdk';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: JointlyClient;
const membersMbr = 2_500 + 400 * 164; // = 65,100 mbr amount that can hold the listing
const proposalMbr = 2_500 + 400 * 172; // = 71,300 mbr amount that can hold the listing

describe('MusAppDAO', () => {
  beforeEach(fixture.beforeEach);
  let creatorAccount: algosdk.Account;
  let registeredAssetCreated: bigint;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount} = fixture.context;
    const { algorand } = fixture;
    creatorAccount = testAccount;

    await getOrCreateKmdWalletAccount(
      { name: 'member1Account', fundWith: algos(20) },
      algorand.client.algod,
      algorand.client.kmd
    );
    await getOrCreateKmdWalletAccount(
      { name: 'member2Account', fundWith: algos(20) },
      algorand.client.algod,
      algorand.client.kmd
    );
    await getOrCreateKmdWalletAccount(
      { name: 'member3Account', fundWith: algos(20) },
      algorand.client.algod,
      algorand.client.kmd
    );
    console.log("Accouns have been Created =")

    appClient = new JointlyClient(
      {
        sender: creatorAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    await appClient.create.createApplication({});
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000)) // equivalent to 0.2 Algo
  });

  test('addMember1', async () => {
    try {
      const { algorand } = fixture;
      const { appAddress } = await appClient.appClient.getAppReference();
      const member1Account = await algorand.account.fromKmd('member1Account');

      const mbrPay = await algorand.transactions.payment({
        sender: creatorAccount.addr,
        receiver: appAddress,
        amount: microAlgos(membersMbr),
      });

      const result = await appClient.addMember({mbrPay:mbrPay, memberAddress:member1Account.addr, memberName:'Musab'},{sender:creatorAccount, sendParams:{fee: algokit.microAlgos(3_000)}});
      console.log("Musab registered=")
      expect(result.confirmation).toBeDefined();

      console.log("Getting Box Content")
      const boxKey = algosdk.decodeAddress(member1Account.addr).publicKey
      const boxContent = await appClient.appClient.getBoxValue(boxKey);

      const decoder = new TextDecoder();

      const member = encodeAddress(boxContent.slice(0, 32))
      expect(member).toBe(member1Account.addr);
      const memberName = decoder.decode(boxContent.slice(32, 132));
      console.log("Box: Member = "+member+" memberName = "+memberName)
      expect(memberName).toBe('Musab');

    } catch (error) {
      console.log(error);
    }
  });

  test('addMember2', async () => {
    try {
      const { algorand } = fixture;
      const { appAddress } = await appClient.appClient.getAppReference();
      const member2Account = await algorand.account.fromKmd('member2Account');

      const mbrPay = await algorand.transactions.payment({
        sender: creatorAccount.addr,
        receiver: appAddress,
        amount: microAlgos(membersMbr),
      });

      const result = await appClient.addMember({mbrPay:mbrPay, memberAddress:member2Account.addr, memberName:"Asaiah"},{sender:creatorAccount, sendParams:{fee: algokit.microAlgos(3_000)}});

      console.log("Asaiah registered =")
      expect(result.confirmation).toBeDefined();

    } catch (error) {
      console.log(error);
    }
  });

  test('addMember3', async () => {
    try {
      const { algorand } = fixture;
      const { appAddress } = await appClient.appClient.getAppReference();
      const member3Account = await algorand.account.fromKmd('member3Account');

      const mbrPay = await algorand.transactions.payment({
        sender: creatorAccount.addr,
        receiver: appAddress,
        amount: microAlgos(membersMbr),
      });

      const result2 = await appClient.addMember({mbrPay:mbrPay, memberAddress:member3Account.addr, memberName:"Satoshi"},{sender:creatorAccount, sendParams:{fee: algokit.microAlgos(3_000)}});
      console.log("Satoshi registered =")
      expect(result2.confirmation).toBeDefined();

    } catch (error) {
      console.log(error);
    }
  });

  test('setProposal', async () => {
    try {
      const { algorand } = fixture;
      const { appAddress } = await appClient.appClient.getAppReference();
      const member1Account = await algorand.account.fromKmd('member1Account');

      const mbrPay = await algorand.transactions.payment({
        sender: creatorAccount.addr,
        receiver: appAddress,
        amount: microAlgos(proposalMbr),
      });
      const result = await appClient.setProposal({mbrPay:mbrPay, proposerAddress:member1Account.addr, proposerName:"Musab", proposal:"I wish to win the algorand hackathon"},{sender:creatorAccount, sendParams:{fee: algokit.microAlgos(3_000)}});
      console.log("Proposal set =")
      expect(result.confirmation).toBeDefined();

      console.log("Getting Proposal Box Content")
      const boxContent = await appClient.appClient.getBoxValue(encodeUint64(1));

      console.log(boxContent);
      const totalVotes = decodeUint64(boxContent.slice(0, 8), 'safe');
      const votesInFavor = decodeUint64(boxContent.slice(8, 16), 'safe');
      const votesAgainst = decodeUint64(boxContent.slice(16, 24), 'safe');
      const executed = decodeUint64(boxContent.slice(24, 32), 'safe');
      const proposerAddress = encodeAddress(boxContent.slice(32, 64));
      const proposerName = new TextDecoder().decode(boxContent.slice(70, 75));
      const proposal = new TextDecoder().decode(boxContent.slice(76, 164));

      console.log("totalVotes = "+totalVotes);
      console.log("votesInFavor = "+votesInFavor);
      console.log("votesAgainst = "+votesAgainst);
      console.log("executed = "+executed);
      console.log("Box Content: Proposer Address= "+proposerAddress+" Name= "+proposerName+" Proposal= "+proposal);

    } catch (error) {
      console.log(error);
    }
  });

  test.skip('getAsset', async () => {
    const asset = await appClient.getAsset({});
    console.log("gotAsset = " , asset.return!.valueOf());
    expect(asset.return?.valueOf()).toBe(registeredAssetCreated);
  });

  test('vote', async () => {
    const { algorand } = fixture; // here we are bringing the algorand client so that we can get the created accounts and assets
    const member1Account = await algorand.account.fromKmd('member1Account');
    const member2Account = await algorand.account.fromKmd('member2Account');
    const member3Account = await algorand.account.fromKmd('member3Account');
    await appClient.vote({inFavor:false,memberAddress:member1Account.addr},{ sender: member1Account.account });
    await appClient.vote({inFavor:false,memberAddress:member2Account.addr},{ sender: member2Account.account });
    const result = await appClient.vote({inFavor:false,memberAddress:member3Account.addr},{ sender: member3Account.account });
    expect(result.confirmation).toBeDefined();

    console.log("Getting Proposal Box Content")
    const boxContent = await appClient.appClient.getBoxValue(encodeUint64(1));

    const totalVotes = decodeUint64(boxContent.slice(0, 8), 'safe');
    const votesInFavor = decodeUint64(boxContent.slice(8, 16), 'safe');
    const votesAgainst = decodeUint64(boxContent.slice(16, 24), 'safe');
    const executed = decodeUint64(boxContent.slice(24, 32), 'safe');
    // const proposerAddress = encodeAddress(boxContent.slice(32, 64));
    // const proposerName = new TextDecoder().decode(boxContent.slice(64, 114));
    // const proposal = new TextDecoder().decode(boxContent.slice(114, 224));

    console.log("totalVotes = "+totalVotes);
    console.log("votesInFavor = "+votesInFavor);
    console.log("votesAgainst = "+votesAgainst);
    console.log("executed = "+executed);
    expect(totalVotes).toEqual(3);
    expect(votesInFavor).toEqual(0);
    expect(votesAgainst).toEqual(3);
    expect(executed).toEqual(0);
  });
});

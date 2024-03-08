const { assert, expect } = require("chai");
const { ethers } = require('hardhat');

describe("Test Voting Contract", function (){
    let voting;
    let owner, addr1, addr2;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Voting');
            voting = await contract.deploy();
        })
        it('should deploy the smart contract', async function() {
            let theOwner = await voting.owner();
            assert.equal(owner.address, theOwner)
        })
    })

    describe('Workflow', function() {
        beforeEach(async function () {
            [owner, addr1] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Voting');
            voting = await contract.deploy();
        })

        it('should NOT start proposals registering if workflow status is not Registering Voters', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .startProposalsRegistering())
                .to.be.revertedWith(
                "Registering proposals cant be started now"
                )
            })

        it('should NOT start proposals registering if not the owner', async function () {
            await expect(
                voting
                .connect(addr1)
                .startProposalsRegistering())
                .to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })
    
        it('should start proposals registering', async function () {
            await voting.startProposalsRegistering();
            assert.equal(await voting.workflowStatus(), 1);
        })

        it('should emit an event when start proposals registering', async function () {
            await expect(
                voting
                .startProposalsRegistering())
                .to.emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(0,1)
        })

        it('should NOT end proposals registering if not the owner', async function () {
            await expect(
                voting
                .connect(addr1)
                .endProposalsRegistering())
                .to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT end proposals registering if workflow status is not Proposals Registration Started', async function () {
            await expect(
                voting
                .endProposalsRegistering())
                .to.be.revertedWith(
                    "Registering proposals havent started yet"
                )
        })

        it('should end proposals registering', async function () {
            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            assert.equal(await voting.workflowStatus(), 2);
        })

        it('should emit an event when end proposals registering', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .endProposalsRegistering())
                .to.emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(1,2)
        })

        it('should NOT start voting session if not the owner', async function () {
            await expect(
                voting
                .connect(addr1)
                .startVotingSession())
                .to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT start voting session if workflow status is not Proposals Registration Ended', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .startVotingSession())
                .to.be.revertedWith(
                    "Registering proposals phase is not finished"
                )
        })

        it('should start voting session', async function () {
            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            assert.equal(await voting.workflowStatus(), 3);
            })

        it('should emit an event when start voting session', async function () {
            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            await expect(
                voting
                .startVotingSession())
                .to.emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(2,3)
        })
        
        it('should NOT end voting session if not the owner', async function () {
            await expect(
                voting
                .connect(addr1)
                .endVotingSession())
                .to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT end voting session if workflow status is not Voting Session Started', async function () {
            await expect(
                voting
                .endVotingSession())
                .to.be.revertedWith(
                    "Voting session havent started yet"
                )
        })

        it('should end voting session', async function () {
            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.endVotingSession();
            assert.equal(await voting.workflowStatus(), 4);
        })

        it('should emit an event when end voting session', async function () {
            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await expect(
                voting
                .endVotingSession())
                .to.emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(3,4)
        })
    })


    describe('Add and Get Voter', async function () {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Voting');
            voting = await contract.deploy();
        })

        it('should NOT add a voter if not the owner', async function () {
            await expect(
                voting
                .connect(addr1)
                .addVoter(addr2.address)
                ).to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
            })

        it('should NOT add a voter if workflow status is not Registering Voters', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .addVoter(addr1.address))
                .to.be.revertedWith(
                    "Voters registration is not open yet"
                )
            })

        it('should NOT add a voter if the voter is already registered', async function () {
            await voting.addVoter(addr1.address);
            await expect(
                voting
                .addVoter(addr1.address))
                .to.be.revertedWith(
                    "Already registered"
                )
            })

        it('should NOT get a voter if not a voter', async function () {
            await voting.addVoter(addr1.address);
            await expect(
                voting
                .getVoter(addr1.address))
                .to.be.revertedWith(
                    "You're not a voter"
                )
            })

        it('should ADD a voter and register the voter', async function () {
            await voting.addVoter(addr1.address);
            await voting.addVoter(addr2.address);
            let voter1 = await voting.connect(addr2).getVoter(addr1.address);
            expect(voter1.isRegistered).to.be.equal(true);
            })
        
        it('should emit an event when a voter is registered', async function (){
            await expect(
                voting
                .addVoter(addr1.address))
                .to.emit(
                    voting,
                    "VoterRegistered"
                )
                .withArgs(
                    addr1.address
                )
        })

        it('should GET a voter', async function () {
            voting.addVoter(addr1.address);
            voting.addVoter(addr2.address);
            await expect(
                voting
                .connect(addr1)
                .getVoter(addr2.address)) 
            })

    })

    describe('Add and Get Proposal', async function () {
        beforeEach(async function() {
            [owner, addr1, addr2] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Voting');
            voting = await contract.deploy();
            
            await voting.addVoter(addr1.address);
            await voting.addVoter(addr2.address);
        })

        it('should NOT add a proposal if not a voter', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .addProposal("Proposition 1"))
                .to.be.revertedWith(
                    "You're not a voter"
                )
            })

        it('should NOT add a proposal if workflow status is not Proposals Registration Started', async function () {
            await expect(
                voting
                .connect(addr1)
                .addProposal("Proposition 1"))
                .to.be.revertedWith(
                    "Proposals are not allowed yet"
                )
            })
       
        it('should NOT add a proposal if the proposal is empty', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .connect(addr1)
                .addProposal(""))
                .to.be.revertedWith(
                    "Vous ne pouvez pas ne rien proposer"
                )
            })

        it('should NOT get a proposal if not a voter', async function () {
            await voting.startProposalsRegistering();
            await voting.connect(addr1).addProposal("Proposition 1");
            await expect(
                voting
                .getOneProposal(1))
                .to.be.revertedWith(
                    "You're not a voter"
                )
            })

        it('should ADD a proposal and register the proposal', async function () {
            await voting.startProposalsRegistering();
            await voting.connect(addr1).addProposal("Proposition 1");
            let proposal1 = await voting.connect(addr1).getOneProposal(1);
            expect(proposal1.description).to.be.equal("Proposition 1");
            expect(proposal1.voteCount).to.be.equal(0);
            })
        
        it('should emit a proposal when add a proposal', async function () {
            await voting.startProposalsRegistering();
            await expect(
                voting
                .connect(addr1)
                .addProposal("Proposition 1"))
                .to.emit(
                    voting,
                    "ProposalRegistered"
                )
                .withArgs(
                    1
                )
        })
        
        it('should GET a proposal', async function () {
            await voting.startProposalsRegistering();
            await voting.connect(addr1).addProposal("Proposition 1");
            await expect(
                voting
                .connect(addr2)
                .getOneProposal(1)) 
            })

    })


    describe('Set and Tally Vote', async function () {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Voting');
            voting = await contract.deploy();
            
            await voting.addVoter(addr1.address);
            await voting.addVoter(addr2.address);
            await voting.addVoter(addr3.address);

            await voting.startProposalsRegistering();
            await voting.connect(addr1).addProposal("Proposition 1");
        })

        it('should NOT vote if not a voter', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await expect(
                voting
                .setVote(1))
                .to.be.revertedWith(
                    "You're not a voter"
                )
            })

        it('should NOT vote if workflow status is not Voting Session Started', async function () {
            await voting.endProposalsRegistering();
            await expect(
                voting
                .connect(addr1)
                .setVote(1))
                .to.be.revertedWith(
                    "Voting session havent started yet"
                )
            })

        it('should NOT vote if has already voted', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.connect(addr1).setVote(1);
            await expect(
                voting
                .connect(addr1)
                .setVote(1))
                .to.be.revertedWith(
                    "You have already voted"
                )
            })
        
        it('should NOT vote if the proposal is not found', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await expect(
                voting
                .connect(addr1)
                .setVote(2))
                .to.be.revertedWith(
                    "Proposal not found"
                )
            })
        

        it('should VOTE and register the vote', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.connect(addr1).setVote(1);

            let voter1 = await voting.connect(addr2).getVoter(addr1.address);
            expect(voter1.hasVoted).to.be.equal(true);
            expect(voter1.votedProposalId).to.be.equal(1);

            let proposal1 = await voting.connect(addr1).getOneProposal(1);
            expect(proposal1.voteCount).to.be.equal(1);
        })

        it('should emit a vote', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await expect(
                voting
                .connect(addr1)
                .setVote(1))
                .to.emit(
                    voting,
                    "Voted"
                )
                .withArgs(
                    addr1.address,1
                )
            })

        it('should NOT tally the votes if not the owner', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.endVotingSession();
            await expect(
                voting
                .connect(addr1)
                .tallyVotes())
                .to.be.revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT tally the votes if workflow status is not Voting Session Ended', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await expect(
                voting
                .tallyVotes())
                .to.be.revertedWith(
                    "Current status is not voting session ended"
                )
        })

        it('should TAllY VOTES', async function () {
            await voting.connect(addr2).addProposal("Proposition 2");
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.connect(addr1).setVote(1);
            await voting.connect(addr2).setVote(2);
            await voting.connect(addr3).setVote(2);
            await voting.endVotingSession();
            await voting.tallyVotes();
            assert.equal(await voting.winningProposalID(), 2);
        })

        it('should change the workflow status into votes tallied', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.endVotingSession();
            await voting.tallyVotes();
            assert.equal(await voting.workflowStatus(), 5);
        })

        it('should emit an event when the voters are tallied', async function () {
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.endVotingSession();
            await expect(
                voting
                .tallyVotes())
                .to.emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(4,5)
        })
    })
})
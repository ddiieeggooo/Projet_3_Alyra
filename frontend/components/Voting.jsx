import { useState, useEffect } from "react"

import AddVoter from './AddVoter'
import AddProposal from './AddProposal'
import Events from './Events'
import SetVote from './SetVote'
import WorkflowStatus from './WorkflowStatus'
import WinningProposalID from './WinningProposalID'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { contractAddress, contractAbi } from '@/constants'

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'

import { publicClient } from '../utils/client'

import { parseAbiItem } from 'viem'


const Voting = () => {

    const { address } = useAccount();
    const [events, setEvents] = useState([]);

    const { data: addressOfVoter, error, isPending, refetch } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'getVoter',
        account: address
    })

    const WinningProposalID = useReadContract ({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'WinningProposalID',
      account: address
    })

    const getEvents = async() => {
        const votersRegisteredEvents = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem("event VoterRegistered(address voterAddress)"),
            fromBlock: 0n,
            toBlock: 'latest'
        })

        const proposalsRegisteredEvents = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem("event ProposalRegistered(uint proposalId)"),
            fromBlock: 0n,
            toBlock: 'latest'
        })

        const combinedEvents = votersRegisteredEvents.map((event) => ({
            type: 'VoterRegistered',
            address: event.args.voterAddress,
            blockNumber: Number(event.blockNumber)
        })).concat(proposalsRegisteredEvents.map((event) => ({
            type: 'ProposalRegistered',
            idProposal: event.args.proposalId,
            blockNumber: Number(event.blockNumber)
        })))

        combinedEvents.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });

        setEvents(combinedEvents)
    }

    useEffect(() => {
        const getAllEvents = async() => {
            if(address !== 'undefined') {
                await getEvents();
            }
        }
        getAllEvents()
    }, [address])

    return (
        <>
        <AddVoter refetch={refetch} getEvents={getEvents} />
        <AddProposal refetch={refetch} getEvents={getEvents} />
        <SetVote refetch={refetch} getEvents={getEvents} />
        <WorkflowStatus refetch={refetch} getEvents={getEvents} />
        <Events events={events} />
        </>
    )
}

export default Voting

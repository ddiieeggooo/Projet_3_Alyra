import { useState, useEffect } from "react"

import AddVoter from './AddVoter'
// import GetVoter from './GetVoter'
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

    //faire winningid
    const { data: winningProposalID } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'winningProposalID',
      account: address
    })

    const getEvents = async() => {
        const votersRegisteredEvents = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem("event VoterRegistered(address voterAddress)"),
            fromBlock: 0n,
            toBlock: 'latest'
        })

        const voterRegisteredEvents = votersRegisteredEvents.map((event) => ({
            type: 'VoterRegistered',
            address: event.args.voterAddress,
            blockNumber: Number(event.blockNumber)
        }))

        voterRegisteredEvents.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });

        setEvents(voterRegisteredEvents)
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
        <WinningProposalID data={winningProposalID}/>
        </>
    )
}

export default Voting

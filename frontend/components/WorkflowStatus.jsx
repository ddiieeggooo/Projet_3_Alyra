'use client'

import { useState } from 'react'
import { Button, VStack, useToast } from '@chakra-ui/react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

const WorkflowStatus = () => {

  const { address } = useAccount();
  const toast = useToast();

  const [workflowStatus, setWorkflowStatus] = useState('');

  const { data: hash, isPending, writeContract } = useWriteContract({
    mutation: {
        onSuccess: () => {
            setWorkflowStatus('');
            refetch();
            getEvents();
            toast({
                title: "Le workflow a bien été modifié",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: error.shortMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        },
    },
})

  const startProposalsRegistering = async() => {
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'startProposalsRegistering',
        account: address,
    })
}

  const endProposalsRegistering = async() => {
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'endProposalsRegistering',
        account: address,
    })
  }

  const startVotingSession = async() => {
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'startVotingSession',
        account: address,
    })
  }

  const endVotingSession = async() => {
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'endVotingSession',
        account: address,
    })
  }

  const tallyVotes = async() => {
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'tallyVotes',
        account: address,
    })
  }

  // const { data: winningProposalID, refetch } = useReadContract({
  //   address: contractAddress,
  //   abi: contractAbi,
  //   functionName: 'tallyVotes',
  //   account: address,
  // });

  return (
    <VStack spacing={4}>
      <h1> ----------------- only admin ------------------------------ </h1>
      <Button colorScheme="blue" onClick={startProposalsRegistering}>{isPending ? 'Starting proposals registering' : 'Start proposals registering'}</Button>
      <Button colorScheme="blue" onClick={endProposalsRegistering}>{isPending ? 'Ending proposals registering' : 'End Proposals Registering'}</Button>
      <Button colorScheme="blue" onClick={startVotingSession}>{isPending ? 'Starting voting session' : 'Start voting session'}</Button>
      <Button colorScheme="blue" onClick={endVotingSession}>{isPending ? 'Ending voting session' : 'End voting session'}</Button>
      <Button colorScheme="blue" onClick={tallyVotes}>{isPending ? 'Tallying votes' : 'Tally Votes'}</Button>
    </VStack>
  );
};

export default WorkflowStatus;

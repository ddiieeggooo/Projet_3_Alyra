'use client'
import { useState } from 'react'
import { Button, Flex, Input, Heading, useToast } from '@chakra-ui/react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { contractAddress, contractAbi } from '@/constants'

const SetVote = ({ refetch, getEvents }) => {

  const { address } = useAccount();
  const toast = useToast();

  const [proposalId, setProposalId] = useState('');

  const { data: hash, isPending, writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setProposalId('');
        refetch();
        getEvents();
        toast({
          title: "Votre vote a bien été pris en compte",
          description: `Voted for proposal ID: ${proposalId}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to cast vote",
          description: error.shortMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  });

  const castVote = async () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'setVote',
      args: [proposalId],
      account: address,
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <>
      <Heading as="h2" size="xl" mt="1rem">
        Chose a ProposalID to Vote
      </Heading>
      <Flex justifyContent="space-between" alignItems="center" width="100%" mt="1rem">
        <Input placeholder="Proposal ID" value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
        <Button colorScheme="pink" onClick={castVote} isLoading={isPending || isConfirming}>
          {isPending || isConfirming ? 'Casting Vote...' : 'Cast Vote'}
        </Button>
      </Flex>
    </>
  );
};

export default SetVote

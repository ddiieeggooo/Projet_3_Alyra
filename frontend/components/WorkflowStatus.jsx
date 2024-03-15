'use client'

import { Button, VStack, useToast } from '@chakra-ui/react';
import { useWriteContract, useAccount } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

const WorkflowStatus = () => {
  const { address } = useAccount();
  const toast = useToast();

  // Function to handle contract interaction feedback
  const handleFeedback = (error, data, functionName) => {
    if (error) {
      toast({
        title: `Failed to execute ${functionName}`,
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else if (data) {
      toast({
        title: `${functionName} executed successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const writeContractConfig = (functionName) => ({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName,
    onSuccess(data) {
      handleFeedback(null, data, functionName);
    },
    onError(error) {
      handleFeedback(error, null, functionName);
    },
  });

  const { write: startProposalsRegistering } = useWriteContract(writeContractConfig('startProposalsRegistering'));
  const { write: endProposalsRegistering } = useWriteContract(writeContractConfig('endProposalsRegistering'));
  const { write: startVotingSession } = useWriteContract(writeContractConfig('startVotingSession'));
  const { write: endVotingSession } = useWriteContract(writeContractConfig('endVotingSession'));
  const { write: tallyVotes } = useWriteContract(writeContractConfig('tallyVotes'));

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={() => startProposalsRegistering()}>Start Proposals Registering</Button>
      <Button colorScheme="blue" onClick={() => endProposalsRegistering()}>End Proposals Registering</Button>
      <Button colorScheme="blue" onClick={() => startVotingSession()}>Start Voting Session</Button>
      <Button colorScheme="blue" onClick={() => endVotingSession()}>End Voting Session</Button>
      <Button colorScheme="blue" onClick={() => tallyVotes()}>Tally Votes</Button>
    </VStack>
  );
};

export default WorkflowStatus;

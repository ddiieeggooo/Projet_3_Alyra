'use client'

import { useReadContract } from 'wagmi';
import { Heading, Box, Text, Flex, useToast } from "@chakra-ui/react"
import { contractAddress, contractAbi } from "@/constants"

const WinningProposalID = ({ refetch, getEvents }) => {
  const toast = useToast();

  const { data: winningProposalID } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
  });

  return (
    <Box>
      <Text>Winning Proposal ID: {winningProposalID.toString()}</Text>
    </Box>
  );

}

export default WinningProposalID;

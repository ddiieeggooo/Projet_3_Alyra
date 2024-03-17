'use client'

// import { useState } from "react"
import { useReadContract, useAccount } from 'wagmi'
// import { Heading, Box, Text, Flex, useToast } from "@chakra-ui/react"
import { contractAddress, contractAbi } from "@/constants"

const WinningProposalID = ({ refetch, getEvents }) => {
  const { address } = useAccount();

  const { data:winningProposalID, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'winningProposalID',
  });


  return (
    <>
        { data !== undefined ? (
            <Text>Your balance is : <Text as='b'>{data.toString()} </Text></Text>
        ) : (
            <Text>Winning proposal ID is still undefined</Text>
        )}
    </>
)
}

export default WinningProposalID;

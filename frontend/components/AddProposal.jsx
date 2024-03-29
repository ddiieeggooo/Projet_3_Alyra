'use client'

import { useState, useEffect } from "react"
import { Heading, Flex, Button, Input, useToast } from "@chakra-ui/react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractAddress, contractAbi } from "@/constants"

const AddProposal = ({ refetch, getEvents }) => {

    const { address } = useAccount();
    const toast = useToast();


    const [proposalAddr, setProposalAddr] = useState('');

    const { data: hash, isPending, writeContract } = useWriteContract({
        mutation: {
            onSuccess: () => {
                setProposalAddr('');
                refetch();
                getEvents();
                toast({
                    title: "La proposal a bien été ajoutée",
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

    const Addproposal = async() => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'addProposal',
            args: [proposalAddr],
            account: address,
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    return (
        <>
            <Heading as='h2' size='xl' mt='1rem'>
                Add a Proposal
            </Heading>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mt="1rem"
            >

                <Input placeholder='New proposal' value={proposalAddr} onChange={(e) => setProposalAddr(e.target.value)} />
                <Button colorScheme='purple' onClick={Addproposal}>{isPending ? 'Adding proposal' : 'Proposal added'} </Button>
            </Flex>
        </>
  )
}

export default AddProposal

'use client'

import { useState } from "react"
import { Heading, Flex, Button, Input, useToast } from "@chakra-ui/react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractAddress, contractAbi } from "@/constants"

const AddProposal = ({ refetch, getEvents }) => {

    const { address } = useAccount();
    const toast = useToast();

    const [addedProposal, setaddedProposal] = useState('');

    const { data: hash, isPending, writeContract } = useWriteContract({
        mutation: {
            onSuccess: () => {
                // getEvents();
                setaddedProposal('');
                refetch();
                getEvents();
                toast({
                    title: "La proposition a bien été ajoutée",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            // Si erreur
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

    const addProposal = async() => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'addProposal',
            args: [addedProposal],
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
                Add a new proposal
            </Heading>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mt="1rem"
            >
                <Input placeholder='New proposal' value={addedProposal} onChange={(e) => setaddedProposal(e.target.value)} />
                <Button colorScheme='blue' onClick={addProposal}>{isPending ? 'Adding proposal' : 'Proposal added'} </Button>
            </Flex>
        </>
  )
}

export default AddProposal

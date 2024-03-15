'use client'
import { useState } from "react"

import { Heading, Flex, Button, Input, useToast } from "@chakra-ui/react"

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

import { contractAddress, contractAbi } from "@/constants"

const AddVoter = ({ refetch, getEvents }) => {

    const { address } = useAccount();
    const toast = useToast();

    const [addedAddr, setaddedAddr] = useState('');

    const { data: hash, isPending, writeContract } = useWriteContract({
        mutation: {
            // Si ça a marché d'écrire dans le contrat
            onSuccess: () => {
                //Faire quelque chose ici si succès, par exemple un refetch
                // refetch();
                // getEvents();
                setaddedAddr('');
                refetch();
                getEvents();
                toast({
                    title: "L'adresse a bien été ajoutée",
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

    const Addvoter = async() => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'addVoter',
            args: [addedAddr],
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
                Add a voter
            </Heading>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mt="1rem"
            >
                <Input placeholder='Address of the new voter' value={addedAddr} onChange={(e) => setaddedAddr(e.target.value)} />
                <Button colorScheme='purple' onClick={Addvoter}>{isPending ? 'Adding addr' : 'Add a new address'} </Button>
            </Flex>
        </>
  )
}

export default AddVoter

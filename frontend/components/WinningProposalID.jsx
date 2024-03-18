'use client'

import { Button, VStack, useToast, Text, Spinner } from '@chakra-ui/react';


const WinningProposalID = ({data}) => {
console.log(data)
  return (
    <>
              <Text>winner :{Number(data)} </Text>
      </>
)
}

export default WinningProposalID;

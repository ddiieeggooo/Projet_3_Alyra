import { Text } from "@chakra-ui/react"

const WinningProposalID = ({ winningProposalID }) => {
  return (
    <>
        { data !== undefined ? (
            <Text>The winning proposal ID is : <Text as='b'>{winningProposalID.toString()} </Text></Text>
        ) : (
            <Text>Winning proposal ID is still undefined</Text>
        )}
    </>
)
}

export default WinningProposalID;

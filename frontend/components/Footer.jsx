"use client"
import { Flex, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Flex
        p="2rem"
        justifyContent="center"
        alignItems="center"
    >
        <Text> &copy; Thibaut Baudry & Diego Bustamente {new Date().getFullYear()}</Text>
    </Flex>
  )
}

export default Footer
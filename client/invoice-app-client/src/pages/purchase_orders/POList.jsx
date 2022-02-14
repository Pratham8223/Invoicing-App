import React from 'react'
import { HStack, Stack, StackDivider, Text, Spacer, Button, Flex } from '@chakra-ui/react'
import { FaFileInvoice } from 'react-icons/fa'

export default function POList({ poData }) {
    return (
        <Stack
            borderWidth='1.6px'
            borderRadius='lg'
            p='4'
            borderColor='gray.200'
            direction='column'
            divider={<StackDivider />}
        >
            {
                poData.map((ele, i) => <POListTile poInfo={ele} key={i} />)
            }
        </Stack>
    )
}

const POListTile = ({ poInfo }) => {
    const dt = new Date(Date.parse(poInfo.created_at))

    return <HStack
        _hover={{
            backgroundColor:'blue'
        }}
        p='2'
    >
        <Flex flexDirection='column'>
            <Text>{poInfo.customer_name} (Rs. {poInfo.subtotal})</Text>
            <Text fontSize='smaller'>{dt.toLocaleDateString()}</Text>

        </Flex>
        <Spacer />
        <Button color='blue.200'><FaFileInvoice /></Button>
    </HStack>
}

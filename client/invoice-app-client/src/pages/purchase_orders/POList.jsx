import React from 'react'
import { Badge, HStack, Stack, StackDivider, Text, Spacer, Button, Flex } from '@chakra-ui/react'
import { FaFileInvoice } from 'react-icons/fa'


export default function POList({ poData, setActivePOItemIndex }) {
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
                poData.length === 0 ? <Badge textAlign='center' colorScheme="red" p="4" borderRadius="lg" >
                    No Purchase Orders
                </Badge> :
                    poData.map((ele, i) => <POListTile onClick={
                        () => {
                            setActivePOItemIndex(i)
                        }
                    } poInfo={ele} key={i} />)
            }
        </Stack>
    )
}

const POListTile = ({ poInfo, onClick }) => {
    const dt = new Date(Date.parse(poInfo.created_at))

    return <HStack
        _hover={{
            color: 'skyblue'
        }}
        onClick={onClick}
    >
        <Flex flexDirection='column'>
            <Text>{poInfo.customer_name} (Rs. {poInfo.subtotal})</Text>
            <Text fontSize='smaller'>{dt.toLocaleDateString()}</Text>
        </Flex>
        <Spacer />
        <Button onClick={() => {
            window.open(process.env.REACT_APP_BACKEND_URI + 'purchase-order/' + poInfo.id + '?res=invoice')
        }} color='blue.200'><FaFileInvoice /></Button>
    </HStack>
}

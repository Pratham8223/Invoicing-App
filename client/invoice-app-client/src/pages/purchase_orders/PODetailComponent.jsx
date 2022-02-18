import { Badge, Center, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function PODetailComponent({ poItem }) {

  console.log(poItem)

  if (poItem === null) {
    return <Center>
      <Badge colorScheme="blue" p="4" borderRadius="lg" m='12'>
        Please Select Purchase Order
      </Badge>
    </Center>
  } else {
    return (
      <Container height='100%' borderLeft='2px' maxW='container.4xl'>
        <Flex justifyContent='space-between'>
          <Flex flexDirection='column'>
            <Text fontSize='sm'>Customer Name</Text>
            <Text fontSize='2xl'>{poItem.customer_name}</Text>
          </Flex>
          <Flex flexDirection='column' textAlign='end'>
            <Text fontSize='sm'>Subtotal</Text>
            <Text fontSize='xl'>Rs. {poItem.subtotal}</Text>
          </Flex>

        </Flex>
      </Container>
    )
  }
}

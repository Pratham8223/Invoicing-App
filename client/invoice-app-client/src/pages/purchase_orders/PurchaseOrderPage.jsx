import { Container, Text, Flex, Grid, GridItem } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import GlobalMonthInput from '../../components/global_month/GlobalMonthInput';
import { poDataContext } from '../../contexts/PODataProvider';
import { poMonthYearContext } from '../../contexts/POMonthYearProvider';

export default function PurchaseOrderPage() {

  const { purchase_orders } = useContext(poDataContext).poData
  const [activePoItemIndex, setActivePOItemIndex] = useState(null)
  const { poMonthYear } = useContext(poMonthYearContext)

  useEffect(() => {
    setActivePOItemIndex(null)
  }, [poMonthYear])

  return <Container maxW='container.2xl'>
    <Flex justifyContent='space-between' alignItems='center'>
      <Text fontWeight='semibold' marginY={2} fontSize='3xl'>Purchase Orders</Text>
      <GlobalMonthInput />
    </Flex>
    <hr />

    
  </Container>;
}

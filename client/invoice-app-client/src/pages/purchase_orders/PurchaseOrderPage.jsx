import { Container, Text, Flex, Grid, GridItem } from '@chakra-ui/react';
import React, { useContext } from 'react';
import GlobalMonthInput from '../../components/global_month/GlobalMonthInput';
import { poDataContext } from '../../contexts/PODataProvider';
import PODetailComponent from './PODetailComponent';
import POList from './POList';

export default function PurchaseOrderPage() {

  const { purchase_orders } = useContext(poDataContext).poData

  return <Container maxW='container.2xl'>
    <Flex justifyContent='space-between' alignItems='center'>
      <Text fontWeight='semibold' marginY={2} fontSize='3xl'>Purchase Orders</Text>
      <GlobalMonthInput />
    </Flex>
    <hr />

    <Grid templateColumns='repeat(5, 1fr)' gap={4} marginTop='4'>
      <GridItem colSpan={3}>
        <POList poData={purchase_orders} />
      </GridItem>
      <GridItem colSpan={2}>
        <PODetailComponent />
      </GridItem>
    </Grid>
  </Container>;
}

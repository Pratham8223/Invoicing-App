import { Badge, Flex, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import ChartContainer from './ChartContainer';
import { poDataContext } from '../../contexts/PODataProvider';
import GlobalMonthInput from '../../components/global_month/GlobalMonthInput';

export default function HomePage() {

  const { poData } = useContext(poDataContext)


  return <>
    <Flex justifyContent='space-between' alignItems='center' mb='6' px='2'>
      <Flex flexDirection='column'>
        <Text color='grey' fontSize='sm'>Monthly Sale</Text>
        <Text fontWeight='semibold' fontSize='3xl'>Rs. {getSubTotal(poData)} /-</Text>
      </Flex>
      <GlobalMonthInput />
    </Flex>
    <ChartContainer />
  </>;
}

const getSubTotal = (poData) => {
  let mSubtotal = 0;
  poData.purchase_orders.forEach(e => {
    mSubtotal += e.subtotal;
  })
  return mSubtotal;
}
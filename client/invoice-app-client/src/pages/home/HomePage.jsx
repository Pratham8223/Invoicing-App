import { Flex, Input, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { poMonthYearContext } from '../../contexts/POMonthYearProvider';
import ChartContainer from './ChartContainer';
import { poDataContext } from '../../contexts/PODataProvider';

export default function HomePage() {

  const { poMonthYear, setPoMonthYear } = useContext(poMonthYearContext)
  const { poData } = useContext(poDataContext)
  const mSubtotal = getSubTotal(poData)

  return <>
    <Flex justifyContent='space-between' alignItems='center' mb='6' px='2'>
      <Flex flexDirection='column'>
        <Text color='grey' fontSize='sm'>Monthly Sale</Text>
        <Text fontWeight='semibold' fontSize='3xl'>Rs. {mSubtotal} /-</Text>
      </Flex>
      <Input type='month' mr='4' w='60' value={poMonthYear} onChange={e => { setPoMonthYear(e.target.value); }} variant='outline' />
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
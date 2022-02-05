import { Flex, Input, Text } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { poMonthYearContext } from '../../contexts/POMonthYearProvider';
import ChartContainer from './ChartContainer';

// import { useRef } from 'react';
// import { loadingRef } from '../../refs/LoadingRef';


export default function HomePage() {

  const { poMonthYear, setPoMonthYear } = useContext(poMonthYearContext)
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return <>
    <Flex justifyContent='space-between' alignItems='center' mb='6' px='2'>
      <Text fontWeight='bold' fontSize='4xl'>{monthNames[new Date(poMonthYear).getMonth()] + " " + (new Date(poMonthYear).getFullYear())}</Text>
      <Input type='month' mr='4' w='60' value={poMonthYear} onChange={e => { setPoMonthYear(e.target.value); }} variant='outline' />
    </Flex>
    <ChartContainer />
  </>;
}

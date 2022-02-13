import { Input } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { poMonthYearContext } from '../../contexts/POMonthYearProvider';

export default function GlobalMonthInput() {
    
  const { poMonthYear, setPoMonthYear } = useContext(poMonthYearContext)

    return <Input type='month' mr='4' w='60'
        value={poMonthYear} onChange={e => { setPoMonthYear(e.target.value); }} variant='outline' />;
}

import { Button } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { loadingRef } from '../../refs/LoadingRef';

export default function HomePage() {

  const ref = useRef(loadingRef)



  return <>
    <Button onClick={e => {
      ref.current.current.continuousStart()
    }}>
      Start
    </Button>

    <Button onClick={e => {
      ref.current.current.complete()
    }}>
      End
    </Button>
  </>;
}

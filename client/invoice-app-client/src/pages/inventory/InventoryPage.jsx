/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Input, InputGroup, InputRightAddon, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, NumberInputStepper, Table, Tbody, Text, Button, Th, Thead, Tr, Flex, useBreakpointValue } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { productDataContext } from '../../contexts/ProductDataProvider';
import { splitIntoSubArray } from '../../utils/PagignationHelper';
import PagedProductsComponent, { InvProduct } from './PagedProductsComponent';

export default function InventoryPage() {

  const { productData } = useContext(productDataContext)
  const [visiblePoductData, setVisibleProductData] = useState(productData)
  const [searchString, setSearchString] = useState('');
  const chunkSize = useBreakpointValue({ base: 5, md: 5, lg: 8 })
  const [page, setPage] = useState(0)


  useEffect(() => {
    setVisibleProductData(
      productData.filter((val) => {
        return JSON.stringify(val).toLowerCase().includes(searchString.toLowerCase());
      })
    );
  }, [searchString])

  const superArray = splitIntoSubArray(visiblePoductData, chunkSize)

  return <Container maxW='container.2xl'>
    <Text fontWeight='semibold' mb='2' fontSize='3xl'>Inventory</Text>
    <hr />
    <InputGroup marginY='4' variant='outline'>
      <Input width='24rem' variant='outline' backgroundColor='whiteAlpha.100' onChange={(e) => { setSearchString(e.target.value) }} value={searchString} placeholder='Product' />
      <InputRightAddon children={<FiSearch />} />
    </InputGroup>
    <hr />
    <Table variant='striped' colorScheme='blue' overflowX='scroll'>
      <Thead>
        <Tr>
          <Th>Sr. No.</Th>
          <Th>Product Name</Th>
          <Th>Price</Th>
          <Th>Tax</Th>
          <Th>Stock</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          searchString ?
            visiblePoductData.map((e, i) =>
              <InvProduct e={e} i={i} key={i} />) :
            superArray.length === 0 ? null :
              <PagedProductsComponent splitedProducts={superArray} page={page} />
        }
      </Tbody>
    </Table>
    {
      searchString ? null :
        superArray.length !== 0 ? <Flex bgColor='telegram.400' color='white' boxShadow='lg' marginX={{ md: '10', sm: '0', base: '0', lg: '80' }} borderColor='teal.400' borderRadius='xl' position='sticky' bottom='2' py='2' flexDirection='row' justifyContent='space-evenly' alignItems='center' marginY='6'>
          <Button bgColor='teal.100' onClick={() => { setPage(0) }} color='black' size='sm'>{"<<<"}</Button>
          <Text>Page <b>{page}</b>  of <b>{superArray.length - 1}</b>  </Text>
          Goto Page : <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={superArray.length - 1}
            _disabled={true}
            onChange={(value) => {
              if (isNaN(value)) {
                setPage(0)
              }
              if (value < superArray.length && value !== 0) {
                setPage(Number.parseInt(value))
              } else {
                setPage(1)
              }
            }}
            defaultValue={page + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button color='black' onClick={() => { setPage(superArray.length - 1) }} bgColor='teal.100' size='sm'>{">>>"}</Button>
        </Flex> : null}
  </Container>
}
import { Container, Text, Flex, Table, Thead, Tr, Th, Tbody, Td, Button, Input, InputGroup, InputRightAddon, IconButton, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import GlobalMonthInput from '../../components/global_month/GlobalMonthInput';
import { poDataContext } from '../../contexts/PODataProvider';
import { FiSearch, FiX, FiFile } from 'react-icons/fi'
import POAction from '../../actions/POAction';

export default function PurchaseOrderPage() {

  const { purchase_orders } = useContext(poDataContext).poData
  const [visibleOrders, setVisibleOrders] = useState(purchase_orders)
  const [searchString, setSearchString] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [delInvoiceId, setDelInvoiceId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const toast = useToast()

  useEffect(() => {
    setVisibleOrders(
      purchase_orders.filter(val => JSON.stringify(val).toLowerCase().includes(searchString.toLowerCase()))
    );
  }, [searchString, purchase_orders])


  console.log(purchase_orders)

  return <>
    <Container maxW='container.2xl' overflowX='scroll'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Text fontWeight='semibold' marginY={2} fontSize='3xl'>Purchase Orders</Text>
        <GlobalMonthInput />

      </Flex>
      <hr />
      <InputGroup marginY='4' variant='outline'>
        <Input width='24rem' variant='outline' backgroundColor='whiteAlpha.100' value={searchString} onChange={e => { setSearchString(e.target.value) }} placeholder='Search by Name, Phone, Date' />
        <InputRightAddon children={<FiSearch />} />
      </InputGroup>
      <hr />
      <Table variant='striped' overflowX='scroll' colorScheme='blue'>
        <Thead>
          <Tr>
            <Th>Sr</Th>
            <Th>Cust. Name</Th>
            <Th>Cust. Email</Th>
            <Th>Cust. Phone</Th>
            <Th>Subtotal</Th>
            <Th>Discount</Th>
            <Th>Items</Th>
            <Th>Date</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleOrders.map((val, index) => <Tr key={index}>
            <Td>
              {index + 1}
            </Td>
            <Td>
              {val.customer_name}
            </Td>
            <Td>
              {val.customer_email}
            </Td>
            <Td>
              {val.customer_phone}
            </Td>
            <Td>
              Rs. {val.subtotal}/-
            </Td>
            <Td>
              {val.discount}%
            </Td>
            <Td>
              {val.po_items.length} Items
            </Td>
            <Td>
              {new Date(Date.parse(val.created_at.split(":")[0].split("T")[0])).toLocaleDateString()}
            </Td>
            <Td>
              <IconButton icon={<FiFile />} size='sm' bgColor='blue.200' onClick={() => {
                window.open(`${process.env.REACT_APP_BACKEND_URI}purchase-order/${val.id}/?res=invoice`)
              }}>Invoice</IconButton>
              <IconButton icon={<FiX />} onClick={() => {
                setDelInvoiceId(val.id)
                onOpen()
              }} size='sm' bgColor='red.500' color='white' ml='2' />
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </Container>

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete Invoice
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' disabled={isLoading} onClick={async () => {
              setIsLoading(true)
              await new POAction().deleteInvoice(delInvoiceId, () => {
                toast({
                  title: "Successfully Deleted",
                  status: "success",
                  isClosable: true
                })
              }, () => {
                toast({
                  title: "Operation failed",
                  status: "error",
                  isClosable: true
                })
              })
              setIsLoading(false)
              onClose()
            }} ml={3}>
              {isLoading ? "Loading" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>

  </>;
}

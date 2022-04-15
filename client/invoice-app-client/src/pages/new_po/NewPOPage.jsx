import { Button, Container, FormControl, FormLabel, Grid, GridItem, Input, Text, Textarea, useDisclosure, useToast, Flex, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import POAction from '../../actions/POAction';
import AddPoDrawer from './AddPoDrawer';
import NwPOTable from './NwPOTable';

export default function NewPOPage() {

  const [invoiceDetails, setInvoiceDetails] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    pending_amount: 0,
    discount: 0,
    due_date: '',
    po_items: []
  })
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()


  const getPoSubtotal = () => {
    var res = 0
    invoiceDetails.po_items.forEach((val) => {
      res = res + (val.cost * val.quantity);
    })
    return res;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true)
    await new POAction().postInvoice(invoiceDetails, ({ id }) => {
      toast({
        title: 'Invoice created!',
        description: `Successfully created an invoice with id ${id} please check it out at purchase orders page.`,
        isClosable: true,
        status: 'success'
      })
      setInvoiceDetails({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        discount: 0.0,
        po_items: []
      })
      setIsLoading(false)
    }, (err) => {
      toast({
        title: 'Error',
        description: 'Unable to create invoice',
        isClosable: true,
        status: 'error'
      })
      setIsLoading(false)
      console.log({ err });
    })
  }

  return <>
    <Container maxW='container.2xl'>
      <Text fontWeight='semibold' marginY={2} fontSize='3xl'>New Invoice</Text>
      <hr style={{ marginBottom: '1rem' }} />
      <Grid templateColumns={{ sm: 'repeat(4, 1fr)', base: 'repeat(4, 1fr)', md: 'repeat(8, 1fr)' }} gap={10}>
        <GridItem w='100%' colSpan={{ base: 4, md: 8, lg: 2 }} >
          <Text fontSize='xl' fontWeight='light'>Client Details</Text>
          <br />
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel htmlFor='name'>Full Name</FormLabel>
              <Input value={invoiceDetails.customer_name} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_name: e.target.value }) }} mb={4} id='name' type='text' />

              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <Input value={invoiceDetails.customer_email} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_email: e.target.value }) }} mb={4} id='email' type='email' />

              <FormLabel htmlFor='phone'>Phone no.</FormLabel>
              <Input value={invoiceDetails.customer_phone} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_phone: e.target.value }) }} mb={4} id='phone' type='number' />

              <FormLabel htmlFor='phone'>Address</FormLabel>
              <Textarea value={invoiceDetails.customer_address} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_address: e.target.value }) }} mb={4} id='email' type='' />

              <FormLabel htmlFor='email'>Discount (In amount)</FormLabel>
              <Input value={invoiceDetails.discount} required min={0} onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, discount: e.target.value }) }} mb={4} id='phone' type='number' />

              <FormLabel htmlFor='email'>Pending Amount</FormLabel>
              <Input value={invoiceDetails.pending_amount} required min={0} onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, pending_amount: e.target.value }) }} mb={4} id='phone' type='number' />
              {
                invoiceDetails.pending_amount > 0 ?
                  <>
                    <FormLabel htmlFor='due-date'>Due Date</FormLabel>
                    <Input type='date' value={invoiceDetails.due_date}
                    required
                    onChange={e => { 
                      console.log(e.target.value)
                      setInvoiceDetails({ ...invoiceDetails, due_date: e.target.value }) }} id='due-date' mb={4} /></> : null
              }
              <Button disabled={isLoading} bgColor='blue.400' type='submit' color='white'>{isLoading ? "Loading..." : "Create Invoice"}</Button>
            </FormControl>
          </form>
        </GridItem>
        <GridItem w='100%' colSpan={{ base: 4, md: 8, lg: 6 }} overflowX='scroll'>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text fontSize='xl' fontWeight='light'>Invoice Details</Text>
            <Box align='end'>
              <Text fontSize='xl' fontWeight='medium'>Rs. {getPoSubtotal() - invoiceDetails.discount}/-</Text>
              <small>(Pending : Rs. {invoiceDetails.pending_amount}/-)</small>
            </Box>
          </Flex>
          <br />
          <NwPOTable invoiceDetails={invoiceDetails} setInvoiceDetails={setInvoiceDetails} />
          <hr />
          <Button width='100%' marginY='8' colorScheme='blue' onClick={onOpen}>Add Item</Button>
        </GridItem>
      </Grid>
    </Container>
    <AddPoDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} btnRef={btnRef} setInvoiceDetails={setInvoiceDetails} />
  </>

}

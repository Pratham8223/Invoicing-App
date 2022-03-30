import { Button, Container, FormControl, FormLabel, Grid, GridItem, Input, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import POAction from '../../actions/POAction';
import NwPOTable from './NwPOTable';

export default function NewPOPage() {

  const [invoiceDetails, setInvoiceDetails] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    po_items: []
  })
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true)
    await new POAction().postInvoice(invoiceDetails, (data) => {
      toast({
        title: 'Invoice created!',
        description: `Successfully created an invoice with id ${data.id} please check it out at purchase orders page.`,
        isClosable: true,
        status: 'success'
      })
      setInvoiceDetails({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        po_items: []
      })
      setIsLoading(false)
    }, (err) => {
      setIsLoading(false)
      console.log({ err });
    })
  }

  return <Container maxW='container.2xl'>
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
            <Button disabled={isLoading} bgColor='blue.400' type='submit' color='white'>{isLoading ? "Loading..." : "Create Invoice"}</Button>
          </FormControl>
        </form>
      </GridItem>
      <GridItem w='100%' colSpan={{ base: 4, md: 8, lg: 6 }} overflowX='scroll'>
        <Text fontSize='xl' fontWeight='light'>Invoice Details</Text>
        <br />
        <NwPOTable invoiceDetails={invoiceDetails} setInvoiceDetails={setInvoiceDetails} />
      </GridItem>
    </Grid>
  </Container>

}

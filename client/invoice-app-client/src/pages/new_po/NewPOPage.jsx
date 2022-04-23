import { Button, Container, FormControl, FormLabel, Grid, GridItem, Input, Text, Textarea, useDisclosure, useToast, Flex, Box, Checkbox, useColorMode } from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import Recaptcha from 'react-recaptcha';
import POAction from '../../actions/POAction';
import { loadingRef } from '../../refs/LoadingRef';
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
    send_to_customer: false,
    po_items: []
  })
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const { current } = useRef(loadingRef)
  const [subscribed, setSubscribed] = useState(false)
  const { colorMode } = useColorMode()

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


    console.log(subscribed)
    if (subscribed === false) {
      toast({
        title: 'Error',
        description: "Please verify captcha.",
        isClosable: true,
        status: 'error'
      })
      setIsLoading(false)
      return
    }


    if ((getPoSubtotal() - invoiceDetails.discount) < 0 || (getPoSubtotal() - invoiceDetails.discount) < invoiceDetails.pending_amount) {
      toast({
        title: 'Error',
        description: "Invalid invoice.",
        isClosable: true,
        status: 'error'
      })
      setIsLoading(false)
      return;
    }

    current.current.continuousStart()

    await new POAction().postInvoice(invoiceDetails, ({ id, email_status }) => {
      if (email_status !== null) {
        if (email_status) {
          toast({
            title: 'Email Sent!',
            description: `Email sent successfully via email.`,
            isClosable: true,
            status: 'success'
          })
        } else {
          toast({
            title: 'Error',
            description: `Invoice was not sent via email.`,
            isClosable: true,
            status: 'error'
          })
        }
      }

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
        pending_amount: 0,
        discount: 0,
        due_date: '',
        send_to_customer: false,
        po_items: []
      })

      setIsLoading(false)
      current.current.complete()
    }, (err) => {
      console.log(err)
      if (err.err === 'Email not verified!. Please verify it in settings session.') {
        toast({
          title: 'Error',
          description: 'Email not verified!. Please verify it in settings session.',
          isClosable: true,
          status: 'error'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Unable to create invoice',
          isClosable: true,
          status: 'error'
        })
      }

      setIsLoading(false)
      current.current.complete()
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
              <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.customer_name} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_name: e.target.value }) }} mb={4} id='name' type='text' />

              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.customer_email} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_email: e.target.value }) }} mb={4} id='email' type='email' />

              <FormLabel htmlFor='phone'>Phone no.</FormLabel>
              <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.customer_phone} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_phone: e.target.value }) }} mb={4} id='phone' type='number' />

              <FormLabel htmlFor='phone'>Address</FormLabel>
              <Textarea variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.customer_address} required onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, customer_address: e.target.value }) }} mb={4} id='email' type='' />

              <FormLabel htmlFor='email'>Discount (In amount)</FormLabel>
              <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.discount} required min={0} onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, discount: e.target.value }) }} mb={4} id='phone' type='number' />

              <FormLabel htmlFor='email'>Pending Amount</FormLabel>
              <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} value={invoiceDetails.pending_amount} required min={0} onChange={(e) => { setInvoiceDetails({ ...invoiceDetails, pending_amount: e.target.value }) }} mb={4} id='phone' type='number' />
              {
                invoiceDetails.pending_amount > 0 ?
                  <>
                    <FormLabel htmlFor='due-date'>Due Date</FormLabel>
                    <Input variant='outline' backgroundColor={colorMode === 'light' ? 'white' : 'whiteAlpha.200'} type='date' value={invoiceDetails.due_date}
                      required
                      onChange={e => {
                        console.log(e.target.value)
                        setInvoiceDetails({ ...invoiceDetails, due_date: e.target.value })
                      }} id='due-date' mb={4} /></> : null
              }
              <Checkbox defaultChecked={invoiceDetails.send_to_customer} checked={invoiceDetails.send_to_customer}
                onChange={e => { setInvoiceDetails({ ...invoiceDetails, send_to_customer: e.target.checked }) }}
              >Send to customer via Email</Checkbox><br />
              <br />
              <Recaptcha
                expiredCallback={() => { setSubscribed(false) }}
                render='explicit'
                sitekey={process.env.REACT_APP_GOGLE_RECAPTCHA_SITE_KEY} verifyCallback={e => {
                  setSubscribed(true)
                }} />

              <Button disabled={isLoading} bgColor='blue.400' type='submit' color='white' mt='5'>{isLoading ? "Loading..." : "Create Invoice"}</Button>
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

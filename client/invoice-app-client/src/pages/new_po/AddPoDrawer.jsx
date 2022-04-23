import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    useToast,
    FormLabel,
    FormControl,
    Text,
    useColorMode,
} from '@chakra-ui/react'

export default function AddPoDrawer({ isOpen, onClose, btnRef, setInvoiceDetails }) {
    const initialState = {
        product: null,
        product_name: '',
        serial_no: '',
        cost: 0,
        discount: 0.0,
        tax: 0,
        quantity: 0
    };
    const [tempPo, setTempPo] = useState(initialState)
    const toast = useToast();
    const { colorMode } = useColorMode()



    const addPoToTable = () => {
        if (!tempPo.product_name) {
            toast({
                title: 'Product name cannot be empty.',
                isClosable: true,
                status: 'error'
            })
            return;
        }

        setInvoiceDetails(e => ({ ...e, po_items: [...e.po_items, tempPo] }))
        setTempPo(initialState)
    }
    return (
        <form onSubmit={addPoToTable}>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Add Invoice Item</DrawerHeader>
                    <hr />
                    <DrawerBody>
                        <br />
                        <FormControl>
                            <FormLabel htmlFor='product_name'>Product Name</FormLabel>
                            <Input variant='outline' backgroundColor={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.300'} mb={2} onChange={(e) => { setTempPo({ ...tempPo, product_name: e.target.value }) }} value={tempPo.product_name} id='product_name' type='text' required />
        
                            <FormLabel htmlFor='serial_no'>Serial No.</FormLabel>
                            <Input variant='outline' backgroundColor={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.300'} mb={4} id='serial_no' type='text' onChange={(e) => { setTempPo({ ...tempPo, serial_no: e.target.value }) }} value={tempPo.serial_no} required />

                            <FormLabel htmlFor='cost'>Cost</FormLabel>
                            <Input variant='outline' backgroundColor={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.300'} min={0} mb={2} id='cost' type='number' onChange={(e) => { setTempPo({ ...tempPo, cost: e.target.value }) }} value={tempPo.cost} required />

                            <FormLabel htmlFor='quantity'>Quantity</FormLabel>
                            <Input variant='outline' backgroundColor={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.300'} min={0} mb={4} id='quantity' type='text' onChange={(e) => { setTempPo({ ...tempPo, quantity: e.target.value }) }} value={tempPo.quantity} required />

                            <FormLabel htmlFor='tax'>Tax (In %)</FormLabel>
                            <Input variant='outline' backgroundColor={colorMode === 'light' ? 'blue.100' : 'whiteAlpha.300'} min={0} mb={4} id='tax' type='text' onChange={(e) => { setTempPo({ ...tempPo, tax: e.target.value }) }} value={tempPo.tax} required />

                            <Text textAlign='end' mt={2}>Rs. {tempPo.cost * tempPo.quantity ? tempPo.cost * tempPo.quantity : "0.00"} /-</Text>
                        </FormControl>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type='submit' onClick={addPoToTable} colorScheme='blue'>Add Item</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </form>
    )
}

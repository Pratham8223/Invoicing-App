import { Table, Tbody, Th, Thead, Td, Input, Tr, IconButton, useToast } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import React, { useState } from 'react'

export default function NwPOTable({ invoiceDetails, setInvoiceDetails }) {

    const initialState = {
        product: null,
        product_name: '',
        cost: 0,
        discount: 0.0,
        tax: 0,
        quantity: 0
    };
    const [tempPo, setTempPo] = useState(initialState)
    const toast = useToast();


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
        <Table>
            <Thead>
                <Tr>
                    <Th width={'120px'}>
                        Sr. no.
                    </Th>
                    <Th>
                        Item
                    </Th>
                    <Th>
                        Quantity
                    </Th>
                    <Th>
                        Amt
                    </Th>
                    <Th>
                        Cost
                    </Th>
                    <Th>
                        Discount
                    </Th>
                    <Th>
                        Tax
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    invoiceDetails.po_items.map((val, index) => <Tr key={index}>
                        <Td>
                            {index + 1}
                        </Td>
                        <Td>
                            {val.product_name}
                        </Td>
                        <Td>
                            {val.quantity} Unit(s)
                        </Td>
                        <Td>
                            Rs. {val.quantity * val.cost}
                        </Td>
                        <Td>
                            Rs. {val.cost}
                        </Td>
                        <Td>
                            {val.discount} %
                        </Td>
                        <Td>
                            {val.tax} %
                        </Td>
                        <Td>
                            <IconButton icon={<FaTrash />} />
                        </Td>
                    </Tr>)
                }
                <Tr>
                    <Td>
                        {invoiceDetails.po_items.length + 1}
                    </Td>
                    <Td>
                        <Input variant='outline' placeholder='Product' value={tempPo.product_name} onChange={e => {
                            setTempPo({ ...tempPo, product_name: e.target.value })
                        }} bgColor='blackAlpha.100' required />
                    </Td>
                    <Td>
                        <Input variant='outline' type='number' bgColor='blackAlpha.100' placeholder='5' value={tempPo.quantity} onChange={e => {
                            setTempPo({ ...tempPo, quantity: e.target.value })
                        }} required />
                    </Td>
                    <Td>
                        {tempPo.cost * tempPo.quantity ? tempPo.cost * tempPo.quantity : "N / A"}
                    </Td>
                    <Td>
                        <Input variant='outline' type='number' bgColor='blackAlpha.100' value={tempPo.cost} onChange={e => {
                            setTempPo({ ...tempPo, cost: e.target.value })
                        }} required />
                    </Td>
                    <Td>
                        <Input variant='outline' type='number' bgColor='blackAlpha.100' value={tempPo.discount} placeholder='In %' onChange={e => {
                            setTempPo({ ...tempPo, discount: e.target.value })
                        }} required /><small style={{
                            width: '100%',
                            textAlign: 'center'
                        }}>In %</small>
                    </Td>
                    <Td>
                        <Input variant='outline' type='number' bgColor='blackAlpha.100' value={tempPo.tax} placeholder='In %' onChange={e => {
                            setTempPo({ ...tempPo, tax: e.target.value })
                        }} required />
                        <small style={{
                            width: '100%',
                            textAlign: 'center'
                        }}>In %</small>
                    </Td>
                    <Td>
                        <IconButton onClick={() => {
                            addPoToTable();
                        }} icon={<FiPlus />} variant='solid' bgColor='green.400' color='white' />
                    </Td>
                </Tr>
            </Tbody>
        </Table >
    )
}

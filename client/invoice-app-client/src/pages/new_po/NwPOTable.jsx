import { Table, Tbody, Th, Thead, Td, Tr, IconButton } from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa'
import React from 'react'

export default function NwPOTable({ invoiceDetails }) {
    return (
        <>
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
                                {val.product_name} <br />
                                <small>{val.serial_no}</small>
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
                                {val.tax} %
                            </Td>
                            <Td>
                                <IconButton icon={<FaTrash />} />
                            </Td>
                        </Tr>)
                    }
                </Tbody>
            </Table >
        </>
    )
}

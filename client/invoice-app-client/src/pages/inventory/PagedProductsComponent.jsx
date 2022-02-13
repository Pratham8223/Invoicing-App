import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

export default function PagedProductsComponent({ splitedProducts, page }) {
  return splitedProducts[page] ?
    splitedProducts[page].map((e, i) =>
      <InvProduct e={e} i={i} key={i} />
    ) : null
}

export const InvProduct = ({ e, i }) => <Tr key={e.id}>
  <Td>
    {i + 1}
  </Td>
  <Td>
    {e.name}
  </Td>
  <Td>
    {e.price}
  </Td>
  <Td>
    {e.tax}%
  </Td>
  <Td>
    {e.available_stock} Units
  </Td>
</Tr>
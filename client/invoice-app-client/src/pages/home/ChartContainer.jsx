import { Container, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import HomeChart from './HomeChart';

export default function ChartContainer() {
    return <SimpleGrid columns={{ base: 1, md: 1, sm: 1, lg: 2 }} gap={4} w={'100%'}>
        <Container maxW='container.xl'>
            <HomeChart />
        </Container>
        <Container maxW='container.xl'>
            <HomeChart />
        </Container>
    </SimpleGrid>
}

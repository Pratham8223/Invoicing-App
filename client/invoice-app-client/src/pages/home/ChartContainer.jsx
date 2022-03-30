import { Container, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { poDataContext } from '../../contexts/PODataProvider';
import { poMonthYearContext } from '../../contexts/POMonthYearProvider';
import HomeChart from './HomeChart';

export default function ChartContainer() {

    const { poData } = useContext(poDataContext)
    const { poMonthYear } = useContext(poMonthYearContext)

    const mSalesData = getSalesData(poData, poMonthYear)

    return <>
        <Tabs colorScheme='blue' variant='solid-rounded'>
            <TabList alignItems='center' alignSelf='center'>
                <Tab>Monthly</Tab>
                <Tab marginX={6}>
                    Yearly
                </Tab>
            </TabList>
            <TabPanels marginY={50}>
                <TabPanel>
                    <Container maxW='container.xl'>
                        <HomeChart kdata={Object.values(mSalesData)} klabels={Object.keys(mSalesData)} ktitle='Monthly' />
                    </Container>
                </TabPanel>
                <TabPanel>
                    <Container maxW='container.xl'>
                        <HomeChart kdata={poData.yearly_data} klabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']} ktitle='Yearly' />
                    </Container>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </>
}


const getSalesData = (poData, poMonthYear) => {

    let chartData = {}
    const daysInMonth = getDaysInMonth(Number.parseInt(poMonthYear.split('-')[1] - 1), Number.parseInt(poMonthYear.split('-')[0]))
    daysInMonth.forEach(e => {
        chartData[e] = 0;
    })

    poData.purchase_orders.forEach((ele) => {
        chartData[Number.parseInt(ele.created_at.split('T')[0].split('-')[2])] += ele.subtotal;
    })
    return chartData;
}


const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
    }
    return days;
}
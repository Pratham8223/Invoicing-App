import { IconButton } from '@chakra-ui/react'
import React, { useContext } from 'react'
import POAction from '../../actions/POAction'
import { poDataContext } from '../../contexts/PODataProvider'
import { poMonthYearContext } from '../../contexts/POMonthYearProvider'
import { FiRefreshCw } from 'react-icons/fi'

export default function RefreshButton() {

    const { poData, setPoData } = useContext(poDataContext)
    const { poMonthYear } = useContext(poMonthYearContext)

    const refreshData = async () => {
        new POAction().getMonthData({
            month: poMonthYear.split('-')[1],
            year: poMonthYear.split('-')[0],
        }, (data) => {
            setPoData({
                yearly_data: poData.yearly_data,
                purchase_orders: data
            })
        }, (err) => { })
    }

    return (
        <IconButton icon={<FiRefreshCw />} onClick={refreshData} colorScheme='blue'>Refresh</IconButton>
    )
}

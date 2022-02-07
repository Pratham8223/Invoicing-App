/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import POAction from '../actions/POAction';
import { loadingRef } from '../refs/LoadingRef';
import { poDataContext } from './PODataProvider';

export const poMonthYearContext = createContext(null)

export default function POMonthYearProvider({ children }) {

    const dt = new Date(Date.now())
    const formatted = (dt.getFullYear() + '-' + ((dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)))
    const [poMonthYear, setPoMonthYear] = useState(formatted);
    const { current } = useRef(loadingRef)
    const { poData, setPoData } = useContext(poDataContext)

    const getNewMonthData = async () => {
        setPoData({
            yearly_data: poData.yearly_data,
            purchase_orders: []
        })
        new POAction().getMonthData({
            month: poMonthYear.split('-')[1],
            year: poMonthYear.split('-')[0],
        }, (data) => {
            setPoData({
                yearly_data: poData.yearly_data,
                purchase_orders: data
            })
        }, (err) => {
            console.log(err);
        })

        if (current.current)
            current.current.complete()

    }

    useMemo(() => {
        getNewMonthData();
    }, [poMonthYear])

    return <poMonthYearContext.Provider value={{ poMonthYear, setPoMonthYear }}>
        {children}
    </poMonthYearContext.Provider>
}

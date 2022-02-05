import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    elements: {
        line: {
            tension: 0
        }
    },
    plugins: {
        legend: {
            display: false,
            position: 'bottom',
        },
        title: {
            position: 'bottom',
            display: true,
            text: 'Monthly Analysis',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Sales',
            data: labels.map(()=>Math.random()*100),
            borderColor: '#0BC5EA',
            backgroundColor: 'skyblue',
            fill: true,
            lineTension: 0.5,
            radius: 4
        },
    ],
};


export default function HomeChart({ ...rest }) {
    return <Line options={options} data={data} {...rest} />;
}

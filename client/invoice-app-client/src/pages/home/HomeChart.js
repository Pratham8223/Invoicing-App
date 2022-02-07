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



export default function HomeChart({ ktitle, klabels, kdata, ...rest }) {

    const data = {
        labels: klabels,
        datasets: [
            {
                label: 'Sales',
                data: kdata ? kdata : kdata,
                borderColor: '#0BC5EA',
                backgroundColor: 'skyblue',
                fill: true,
                lineTension: 0.5,
                radius: 2
            },
        ],
    };

    const options = {
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
                text: ktitle ? ktitle : "Analysis",
            },
        },
    };

    return <Line options={options} data={data} {...rest} />;
}

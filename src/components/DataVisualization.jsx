import React from 'react';
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataVisualization = ({ data }) => {
  const { t } = useLanguage();

  if (!data || !data.years || !data.temperature || !data.co2) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{t('errors.noData')}</Typography>
      </Box>
    );
  }

  const temperatureData = {
    labels: data.years,
    datasets: [
      {
        label: t('charts.temperature'),
        data: data.temperature,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      }
    ]
  };

  const co2Data = {
    labels: data.years,
    datasets: [
      {
        label: t('charts.co2'),
        data: data.co2,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 3
    }}>
      <Box sx={{ height: '100%', minHeight: 300 }}>
        <Line options={options} data={temperatureData} />
      </Box>
      <Box sx={{ height: '100%', minHeight: 300 }}>
        <Line options={options} data={co2Data} />
      </Box>
    </Box>
  );
};

export default DataVisualization;

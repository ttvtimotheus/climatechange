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
        <Typography color="text.secondary">{t('errors.noData')}</Typography>
      </Box>
    );
  }

  const temperatureData = {
    labels: data.years,
    datasets: [
      {
        label: t('charts.temperature'),
        data: data.temperature,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const co2Data = {
    labels: data.years,
    datasets: [
      {
        label: t('charts.co2'),
        data: data.co2,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#F1F5F9',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94A3B8' }
      },
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      gap: 2
    }}>
      <Box sx={{ height: '100%', minHeight: 250 }}>
        <Line options={options} data={temperatureData} />
      </Box>
      <Box sx={{ height: '100%', minHeight: 250 }}>
        <Line options={options} data={co2Data} />
      </Box>
    </Box>
  );
};

export default DataVisualization;

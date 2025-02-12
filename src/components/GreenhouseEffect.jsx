import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  Stack,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import { Info, Cloud } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const calculateMovingAverage = (data, windowSize) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    
    // Berechne den Durchschnitt für das Fenster
    for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
      sum += data[j];
      count++;
    }
    
    result.push(Number((sum / count).toFixed(2)));
  }
  return result;
};

const GreenhouseEffect = ({ climateData, onWindowSizeChange }) => {
  const [windowSize, setWindowSize] = useState(20);
  const [movingAverages, setMovingAverages] = useState({
    temperature: [],
    co2: []
  });

  useEffect(() => {
    if (climateData?.temperature && climateData?.co2) {
      setMovingAverages({
        temperature: calculateMovingAverage(climateData.temperature, windowSize),
        co2: calculateMovingAverage(climateData.co2, windowSize)
      });
    }
  }, [climateData, windowSize]);

  const chartData = {
    labels: climateData?.years || [],
    datasets: [
      {
        label: 'Temperatur (°C)',
        data: climateData?.temperature || [],
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
      },
      {
        label: `${windowSize}-Jahres-Mittel Temperatur`,
        data: movingAverages.temperature,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'CO₂ (ppm)',
        data: climateData?.co2 || [],
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 1,
        pointRadius: 0,
        borderDash: [5, 5],
        yAxisID: 'co2',
      },
      {
        label: `${windowSize}-Jahres-Mittel CO₂`,
        data: movingAverages.co2,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'co2',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperaturanstieg (°C)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      co2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'CO₂-Konzentration (ppm)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const handleWindowSizeChange = (event, newValue) => {
    setWindowSize(newValue);
    onWindowSizeChange?.(newValue);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cloud sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Treibhauseffekt-Analyse
          </Typography>
          <Tooltip title="Visualisierung des gleitenden Durchschnitts für Temperatur und CO₂-Konzentration">
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Mittelwert-Zeitraum: {windowSize} Jahre
          </Typography>
          <Slider
            value={windowSize}
            onChange={handleWindowSizeChange}
            min={5}
            max={50}
            step={5}
            marks={[
              { value: 5, label: '5' },
              { value: 20, label: '20' },
              { value: 35, label: '35' },
              { value: 50, label: '50' }
            ]}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(46, 125, 50, 0.16)',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ height: '400px' }}>
          <Line data={chartData} options={options} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'rgba(255, 99, 132, 0.1)',
                border: '1px solid rgba(255, 99, 132, 0.2)',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Temperatur-Trend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Durchschnittlicher Anstieg im {windowSize}-Jahres-Mittel:{' '}
                <strong>
                  {movingAverages.temperature[movingAverages.temperature.length - 1]?.toFixed(2)}°C
                </strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'rgba(75, 192, 192, 0.1)',
                border: '1px solid rgba(75, 192, 192, 0.2)',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                CO₂-Trend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Durchschnittliche Konzentration im {windowSize}-Jahres-Mittel:{' '}
                <strong>
                  {movingAverages.co2[movingAverages.co2.length - 1]?.toFixed(0)} ppm
                </strong>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default GreenhouseEffect;

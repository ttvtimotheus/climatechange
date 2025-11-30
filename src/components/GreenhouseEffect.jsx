import { useState, useEffect, useMemo } from 'react';
import { Cloud } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const calcMovingAvg = (data, window) => {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    return Number((slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2));
  });
};

const GreenhouseEffect = ({ climateData }) => {
  const [windowSize, setWindowSize] = useState(20);

  const movingAverages = useMemo(() => {
    if (!climateData?.temperature) return { temperature: [], co2: [] };
    return {
      temperature: calcMovingAvg(climateData.temperature, windowSize),
      co2: calcMovingAvg(climateData.co2, windowSize)
    };
  }, [climateData, windowSize]);

  const chartData = {
    labels: climateData?.years || [],
    datasets: [
      { label: 'Temperature', data: climateData?.temperature || [], borderColor: 'rgba(239,68,68,0.4)', borderWidth: 1, pointRadius: 0, borderDash: [5, 5] },
      { label: `${windowSize}yr Avg Temp`, data: movingAverages.temperature, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
      { label: 'CO₂', data: climateData?.co2 || [], borderColor: 'rgba(34,211,238,0.4)', borderWidth: 1, pointRadius: 0, borderDash: [5, 5], yAxisID: 'co2' },
      { label: `${windowSize}yr Avg CO₂`, data: movingAverages.co2, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)', fill: true, tension: 0.4, yAxisID: 'co2' }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { color: '#a1a1aa', font: { size: 10 } } },
      tooltip: { backgroundColor: '#12121a', titleColor: '#f4f4f5', bodyColor: '#f4f4f5', borderColor: '#2a2a3a', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: '#2a2a3a' }, ticks: { color: '#71717a' } },
      y: { position: 'left', grid: { color: '#2a2a3a' }, ticks: { color: '#71717a' }, title: { display: true, text: 'Temp (°C)', color: '#71717a' } },
      co2: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#71717a' }, title: { display: true, text: 'CO₂ (ppm)', color: '#71717a' } }
    }
  };

  const lastTemp = movingAverages.temperature[movingAverages.temperature.length - 1] || 0;
  const lastCO2 = movingAverages.co2[movingAverages.co2.length - 1] || 0;
  const percentage = ((windowSize - 5) / 45) * 100;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Cloud className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold text-accent">Greenhouse Effect Analysis</h3>
      </div>

      <div className="mb-4">
        <p className="text-xs text-text-muted mb-2">Moving Average: {windowSize} years</p>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={windowSize}
          onChange={(e) => setWindowSize(Number(e.target.value))}
          className="w-full h-1.5 appearance-none bg-border rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`
          }}
        />
      </div>

      <div className="flex-1 min-h-[200px]">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs font-medium text-red-400 mb-1">Temperature Trend</p>
          <p className="text-lg font-semibold text-red-400">{lastTemp.toFixed(2)}°C</p>
        </div>
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-xs font-medium text-cyan-400 mb-1">CO₂ Trend</p>
          <p className="text-lg font-semibold text-cyan-400">{lastCO2.toFixed(0)} ppm</p>
        </div>
      </div>
    </div>
  );
};

export default GreenhouseEffect;

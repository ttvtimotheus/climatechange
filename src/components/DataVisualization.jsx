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
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DataVisualization = ({ data }) => {
  const { t } = useLanguage();

  if (!data?.years?.length) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        {t('errors.noData')}
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#a1a1aa', font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: '#12121a',
        titleColor: '#f4f4f5',
        bodyColor: '#f4f4f5',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: { grid: { color: '#2a2a3a' }, ticks: { color: '#71717a' } },
      y: { grid: { color: '#2a2a3a' }, ticks: { color: '#71717a' } }
    }
  };

  const tempData = {
    labels: data.years,
    datasets: [{
      label: t('charts.temperature'),
      data: data.temperature,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const co2Data = {
    labels: data.years,
    datasets: [{
      label: t('charts.co2'),
      data: data.co2,
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-full min-h-[200px]">
        <Line options={options} data={tempData} />
      </div>
      <div className="h-full min-h-[200px]">
        <Line options={options} data={co2Data} />
      </div>
    </div>
  );
};

export default DataVisualization;

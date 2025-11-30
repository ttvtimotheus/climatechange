import { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

const getTemperatureColor = (value) => {
  if (value >= 4) return '#DC2626';
  if (value >= 3) return '#EA580C';
  if (value >= 2) return '#F59E0B';
  if (value >= 1) return '#84CC16';
  return '#22C55E';
};

const WorldMap = ({ data = [] }) => {
  return (
    <div className="w-full h-full bg-background overflow-hidden">
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(34, 211, 238, 0.08)"
                  stroke="rgba(34, 211, 238, 0.2)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: 'rgba(34, 211, 238, 0.15)', outline: 'none', cursor: 'pointer' },
                    pressed: { fill: 'rgba(34, 211, 238, 0.2)', outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>

          {data.map(({ lat, lng, value, label }) => {
            const color = getTemperatureColor(value);
            const size = Math.max(5, Math.min(value * 2.5 + 4, 14));
            
            return (
              <Marker key={label} coordinates={[lng, lat]}>
                <g style={{ cursor: 'pointer' }}>
                  <circle r={size + 3} fill={`${color}33`} />
                  <circle
                    r={size}
                    fill={color}
                    stroke="#12121a"
                    strokeWidth={1.5}
                    style={{ filter: `drop-shadow(0 2px 4px ${color}66)` }}
                  />
                  <text
                    textAnchor="middle"
                    y={-size - 6}
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fill: '#f4f4f5',
                      fontSize: '9px',
                      fontWeight: 600,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
                    }}
                  >
                    {label}
                  </text>
                </g>
                <title>{`${label}: +${value.toFixed(1)}°C`}</title>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(WorldMap);

import React, { useState, useEffect } from 'react';
import './LiveMetrics.css';

interface MetricData {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

const LiveMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { id: 'speed', label: 'Avg Speed', value: 45, unit: 'km/h', trend: 'up', color: '#10b981' },
    { id: 'volume', label: 'Traffic Volume', value: 1247, unit: 'veh/h', trend: 'down', color: '#3b82f6' },
    { id: 'density', label: 'Density', value: 28, unit: 'veh/km', trend: 'stable', color: '#f59e0b' },
    { id: 'incidents', label: 'Active Incidents', value: 3, unit: '', trend: 'down', color: '#ef4444' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="live-metrics">
      <h3 className="metrics-title">📊 Live Metrics</h3>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div 
            key={metric.id} 
            className="metric-card"
            style={{ 
              '--metric-color': metric.color,
              animationDelay: `${index * 0.1}s`
            } as React.CSSProperties}
          >
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-trend">{getTrendIcon(metric.trend)}</span>
            </div>
            <div className="metric-value">
              <span className="value">{Math.round(metric.value)}</span>
              <span className="unit">{metric.unit}</span>
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${Math.min(100, (metric.value / 100) * 100)}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMetrics;

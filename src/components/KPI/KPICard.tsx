import React from 'react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  unit?: string;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  unit, 
  subtitle, 
  icon, 
  trend 
}) => {
  const getTrendClass = () => {
    if (change === undefined) return '';
    if (change > 0) return trend === 'up' ? 'trend-positive' : 'trend-negative';
    if (change < 0) return trend === 'down' ? 'trend-positive' : 'trend-negative';
    return 'trend-neutral';
  };

  const getTrendIcon = () => {
    if (change === undefined) return '';
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  return (
    <div className="kpi-card animate-fade-in">
      <div className="kpi-header">
        <div className="kpi-title">
          {icon && <span className="kpi-icon">{icon}</span>}
          {title}
        </div>
        {change !== undefined && (
          <div className={`kpi-change ${getTrendClass()}`}>
            <span className="trend-icon">{getTrendIcon()}</span>
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="kpi-value">
        <span className="value">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
      
      {subtitle && (
        <div className="kpi-subtitle">{subtitle}</div>
      )}
    </div>
  );
};

export default KPICard;

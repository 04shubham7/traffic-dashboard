import React, { useEffect, useRef } from 'react';
import './TrafficChart.css';

interface TrafficChartProps {
  data?: number[];
  labels?: string[];
  title?: string;
  type?: 'line' | 'bar' | 'area';
}

const TrafficChart: React.FC<TrafficChartProps> = ({ 
  data = [65, 78, 45, 89, 67, 82, 91, 76, 58, 94, 73, 85], 
  labels = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
  title = 'Traffic Flow',
  type = 'area'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Calculate points
    const maxValue = Math.max(...data);
    const points = data.map((value, index) => ({
      x: padding + (chartWidth / (data.length - 1)) * index,
      y: height - padding - (value / maxValue) * chartHeight
    }));

    if (type === 'area') {
      // Draw area fill
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height - padding);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, height - padding);
      ctx.closePath();
      ctx.fill();
    }

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Create smooth curve using quadratic curves
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const cpx = (prevPoint.x + currentPoint.x) / 2;
      const cpy = (prevPoint.y + currentPoint.y) / 2;
      
      ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, cpy);
    }
    
    ctx.stroke();

    // Draw data points
    points.forEach((point) => {
      // Outer glow
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fill();
      
      // Inner circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      
      // White center
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
      if (index < points.length) {
        ctx.fillText(label, points[index].x, height - 10);
      }
    });

    // Draw values on hover (simplified - would need proper event handling)
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach((point, pointIndex) => {
      ctx.fillText(data[pointIndex].toString(), point.x, point.y - 15);
    });

  }, [data, labels, type]);

  return (
    <div className="traffic-chart">
      <h4 className="chart-title">{title}</h4>
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  );
};

export default TrafficChart;

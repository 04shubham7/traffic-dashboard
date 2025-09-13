import React, { useState, useEffect } from 'react';
import { timeSeriesData } from '../../data/mockData';
import './Timeline.css';

interface TimelineProps {
  onTimeChange?: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onTimeChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showBaseline, setShowBaseline] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = (prev + 1) % 24;
          onTimeChange?.(next);
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, onTimeChange]);

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
    onTimeChange?.(time);
  };

  const getCurrentData = () => timeSeriesData[currentTime];
  const currentData = getCurrentData();

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="timeline-controls">
          <button 
            className={`control-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="speed-controls">
            <span className="control-label">Speed:</span>
            {[0.5, 1, 2, 4].map(speed => (
              <button
                key={speed}
                className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                onClick={() => setPlaybackSpeed(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>
          
          <div className="view-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showBaseline}
                onChange={(e) => setShowBaseline(e.target.checked)}
              />
              Show Baseline Comparison
            </label>
          </div>
        </div>
        
        <div className="timeline-info">
          <div className="current-time">
            {String(currentTime).padStart(2, '0')}:00
          </div>
          <div className="data-summary">
            Travel Time: {currentData.optimized.toFixed(1)}min
            {showBaseline && (
              <span className="baseline-comparison">
                (vs {currentData.baseline.toFixed(1)}min baseline)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="timeline-scrubber">
        <div className="timeline-track">
          {/* Hour markers */}
          <div className="hour-markers">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className={`hour-marker ${i === currentTime ? 'current' : ''}`}
                style={{ left: `${(i / 23) * 100}%` }}
                onClick={() => handleTimeChange(i)}
              >
                <div className="marker-line"></div>
                <div className="marker-label">{String(i).padStart(2, '0')}</div>
              </div>
            ))}
          </div>

          {/* Data visualization */}
          <div className="data-track">
            <svg className="timeline-chart" viewBox="0 0 1000 100">
              {/* Baseline line */}
              {showBaseline && (
                <polyline
                  className="baseline-line"
                  points={timeSeriesData.map((d, i) => 
                    `${(i / 23) * 1000},${100 - (d.baseline / 40) * 80}`
                  ).join(' ')}
                />
              )}
              
              {/* Optimized line */}
              <polyline
                className="optimized-line"
                points={timeSeriesData.map((d, i) => 
                  `${(i / 23) * 1000},${100 - (d.optimized / 40) * 80}`
                ).join(' ')}
              />
              
              {/* Incident markers */}
              {timeSeriesData.map((d, i) => 
                d.incidents > 0 && (
                  <circle
                    key={i}
                    className="incident-marker"
                    cx={(i / 23) * 1000}
                    cy={20}
                    r="4"
                  />
                )
              )}
              
              {/* Current time indicator */}
              <line
                className="current-time-line"
                x1={(currentTime / 23) * 1000}
                y1="0"
                x2={(currentTime / 23) * 1000}
                y2="100"
              />
            </svg>
          </div>

          {/* Scrubber handle */}
          <div 
            className="scrubber-handle"
            style={{ left: `${(currentTime / 23) * 100}%` }}
            onMouseDown={(e) => {
              const track = e.currentTarget.parentElement!;
              const handleMouseMove = (e: MouseEvent) => {
                const rect = track.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const time = Math.round((x / rect.width) * 23);
                handleTimeChange(time);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="handle-grip"></div>
          </div>
        </div>
      </div>

      <div className="timeline-legend">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-line optimized"></div>
            <span>AI Optimized</span>
          </div>
          {showBaseline && (
            <div className="legend-item">
              <div className="legend-line baseline"></div>
              <span>Baseline</span>
            </div>
          )}
          <div className="legend-item">
            <div className="legend-dot incident"></div>
            <span>Incidents</span>
          </div>
        </div>
        
        <div className="performance-summary">
          <div className="summary-item">
            <span className="summary-label">Avg Improvement:</span>
            <span className="summary-value text-success">
              {Math.round(((currentData.baseline - currentData.optimized) / currentData.baseline) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

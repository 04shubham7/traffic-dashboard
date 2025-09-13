import React, { useState } from 'react';
import { type Junction } from '../../data/mockData';
import './JunctionPanel.css';

interface JunctionPanelProps {
  junction: Junction | null;
}

const JunctionPanel: React.FC<JunctionPanelProps> = ({ junction }) => {
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  const [overrideTimer, setOverrideTimer] = useState<number | null>(null);

  if (!junction) {
    return (
      <div className="junction-panel">
        <div className="panel-placeholder">
          <div className="placeholder-icon">🚦</div>
          <h3>Select a Junction</h3>
          <p>Click on any junction marker on the map to view detailed information and controls.</p>
        </div>
      </div>
    );
  }

  const handleOverride = () => {
    setShowOverrideConfirm(false);
    setOverrideTimer(600); // 10 minutes in seconds
    
    // Simulate countdown
    const interval = setInterval(() => {
      setOverrideTimer(prev => {
        if (prev && prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'red': return 'var(--critical)';
      case 'yellow': return 'var(--warning)';
      case 'green': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="junction-panel animate-slide-in">
      <div className="panel-header">
        <div className="junction-title">
          <h3>{junction.name}</h3>
          <span className="junction-id">{junction.id}</span>
        </div>
        <div className="junction-status">
          <div 
            className="phase-indicator"
            style={{ backgroundColor: getPhaseColor(junction.currentPhase) }}
          >
            {junction.currentPhase.toUpperCase()}
          </div>
          <div className="countdown">{junction.countdown}s</div>
        </div>
      </div>

      <div className="panel-content">
        {/* Current Traffic State */}
        <div className="section">
          <h4>Current Traffic State</h4>
          <div className="traffic-grid">
            <div className="traffic-metric">
              <span className="metric-label">Queue Length</span>
              <span className="metric-value">{junction.queueLength}m</span>
            </div>
            <div className="traffic-metric">
              <span className="metric-label">Avg Speed</span>
              <span className="metric-value">{junction.avgSpeed} km/h</span>
            </div>
            <div className="traffic-metric">
              <span className="metric-label">Congestion</span>
              <span className={`metric-value congestion-${junction.congestionLevel}`}>
                {junction.congestionLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Lane-wise Data */}
        <div className="section">
          <h4>Lane-wise Vehicle Count</h4>
          <div className="lane-grid">
            {Object.entries(junction.laneData).map(([direction, data]) => (
              <div key={direction} className="lane-item">
                <div className="lane-direction">{direction.toUpperCase()}</div>
                <div className="lane-count">{data.count}</div>
                <div className="lane-speed">{data.avgSpeed} km/h</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="section ai-section">
          <h4>🤖 AI Recommendation</h4>
          <div className="ai-recommendation">
            <div className="recommendation-header">
              <span className="recommendation-title">{junction.aiRecommendation.phase}</span>
              <div className="confidence-badge">
                Confidence: {Math.round(junction.aiRecommendation.confidence * 100)}%
              </div>
            </div>
            <div className="recommendation-details">
              <div className="detail-item">
                <span>Duration:</span>
                <span>{junction.aiRecommendation.duration}s</span>
              </div>
              <div className="detail-item">
                <span>Expected Impact:</span>
                <span>{junction.aiRecommendation.expectedImpact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Override Controls */}
        <div className="section override-section">
          <h4>Manual Override</h4>
          {overrideTimer ? (
            <div className="override-active">
              <div className="override-status">
                <span className="status-indicator active"></span>
                Override Active
              </div>
              <div className="override-timer">
                Auto-rollback in: {formatTime(overrideTimer)}
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setOverrideTimer(null)}
              >
                Rollback Now
              </button>
            </div>
          ) : (
            <div className="override-controls">
              <button 
                className="btn btn-primary"
                onClick={() => setShowOverrideConfirm(true)}
              >
                Apply AI Recommendation
              </button>
              <div className="quick-actions">
                <button className="btn btn-outline">Emergency Mode</button>
                <button className="btn btn-outline">Extend Current</button>
              </div>
            </div>
          )}
        </div>

        {/* What-if Simulator */}
        <div className="section simulator-section">
          <h4>⚡ What-if Simulator</h4>
          <div className="simulator-controls">
            <div className="input-group">
              <label>Inflow Change</label>
              <select className="simulator-input">
                <option>+20% for 10 min</option>
                <option>+50% for 5 min</option>
                <option>-30% for 15 min</option>
              </select>
            </div>
            <button className="btn btn-outline btn-sm">Run Simulation</button>
          </div>
        </div>
      </div>

      {/* Override Confirmation Modal */}
      {showOverrideConfirm && (
        <div className="modal-overlay" onClick={() => setShowOverrideConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Confirm Override</h4>
            <p>Apply '{junction.aiRecommendation.phase}' for {junction.aiRecommendation.duration} seconds?</p>
            <div className="impact-preview">
              <strong>Expected Impact:</strong> {junction.aiRecommendation.expectedImpact}
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowOverrideConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleOverride}
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JunctionPanel;

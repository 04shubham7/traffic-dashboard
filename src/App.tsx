import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import KPICard from './components/KPI/KPICard';
import TrafficMap from './components/Map/TrafficMap';
import JunctionPanel from './components/Panel/JunctionPanel';
import TrafficChart from './components/Charts/TrafficChart';
import LiveMetrics from './components/Widgets/LiveMetrics';
import { mockKPIs, mockIncidents, corridorData, type Junction } from './data/mockData';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(null);
  const [activeTab, setActiveTab] = useState('Live Operations');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJunctionSelect = (junction: Junction) => {
    setSelectedJunction(junction);
  };

  return (
    <div className="app">
      <Header currentTime={currentTime} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'Live Operations' && (
          <>
            {/* Top Map Section - Full Width */}
            <section className="map-section">
              <TrafficMap 
                onJunctionSelect={handleJunctionSelect}
                selectedJunction={selectedJunction?.id}
              />
            </section>

            {/* KPI Bar */}
            <section className="kpi-section">
              <div className="kpi-grid">
                <KPICard
                  title="Congestion Index"
                  value={mockKPIs.congestionIndex.value}
                  change={mockKPIs.congestionIndex.change}
                  icon="🌡️"
                  trend="down"
                />
                <KPICard
                  title="Average Delay"
                  value={mockKPIs.avgDelay.value}
                  unit="min"
                  change={mockKPIs.avgDelay.change}
                  icon="⏱️"
                  trend="down"
                />
                <KPICard
                  title="Active Incidents"
                  value={mockKPIs.activeIncidents.value}
                  subtitle={`Median clearance: ${mockKPIs.activeIncidents.medianClearance} min`}
                  icon="⚠️"
                />
                <KPICard
                  title="AI Impact Today"
                  value={`${mockKPIs.aiImpact.value}%`}
                  subtitle={mockKPIs.aiImpact.description}
                  icon="🤖"
                  trend="up"
                />
              </div>
            </section>

            {/* Content Grid Below Map */}
            <section className="content-section">
              <div className="content-grid">
                {/* Left Panel - Incidents & Corridors */}
                <div className="left-panel">
                  <div className="incidents-panel">
                    <h3>🚨 Active Incidents</h3>
                    <div className="incidents-list">
                      {mockIncidents.map(incident => (
                        <div key={incident.id} className={`incident-item severity-${incident.severity}`}>
                          <div className="incident-header">
                            <span className="incident-type">{incident.type.toUpperCase()}</span>
                            <span className="incident-eta">{incident.eta}</span>
                          </div>
                          <div className="incident-location">{incident.location}</div>
                          <div className="incident-description">{incident.description}</div>
                          <div className="incident-impact">{incident.impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="corridors-panel">
                    <h3>🛣️ Corridor Performance</h3>
                    <div className="corridors-list">
                      {corridorData.map((corridor, index) => (
                        <div key={index} className="corridor-item">
                          <div className="corridor-name">{corridor.name}</div>
                          <div className="corridor-metrics">
                            <span className="travel-time">{corridor.travelTime}min</span>
                            <span className={`change ${corridor.change < 0 ? 'positive' : 'negative'}`}>
                              {corridor.change > 0 ? '+' : ''}{corridor.change}%
                            </span>
                          </div>
                          <div className="reliability-bar">
                            <div 
                              className="reliability-fill"
                              style={{ width: `${corridor.reliability * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Junction Details & Live Metrics */}
                <div className="right-panel">
                  <JunctionPanel junction={selectedJunction} />
                  <LiveMetrics />
                </div>
              </div>
            </section>

            {/* Bottom Timeline */}
            <section className="timeline-section">
              <div className="timeline-wrapper">
                <h3>📊 Timeline Analysis</h3>
                <div className="timeline-content">
                  <div className="timeline-chart">
                    <TrafficChart 
                      title="24-Hour Traffic Pattern Analysis"
                      data={[45, 52, 68, 85, 92, 78, 65, 58, 62, 75, 88, 95, 89, 82, 76, 69, 73, 81, 86, 79, 71, 63, 55, 48]}
                      labels={['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']}
                      type="area"
                    />
                    <div className="time-controls">
                      <button className="btn btn-primary">▶️ Play</button>
                      <button className="btn btn-secondary">⏸️ Pause</button>
                      <span className="current-time">Current: {new Date().getHours()}:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        
        {activeTab === 'Incidents' && (
          <div className="tab-content">
            <h2>🚨 Incident Management</h2>
            <div className="incidents-grid">
              {mockIncidents.map(incident => (
                <div key={incident.id} className={`incident-card severity-${incident.severity}`}>
                  <div className="incident-header">
                    <span className="incident-type">{incident.type.toUpperCase()}</span>
                    <span className={`status-badge ${incident.status}`}>{incident.status.toUpperCase()}</span>
                  </div>
                  <h3>{incident.location}</h3>
                  <p>{incident.description}</p>
                  <div className="incident-meta">
                    <span>ETA: {incident.eta}</span>
                    <span>Impact: {incident.impact}</span>
                  </div>
                  <div className="incident-actions">
                    <button className="btn btn-primary">Acknowledge</button>
                    <button className="btn btn-secondary">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'Optimization' && (
          <div className="tab-content">
            <h2>🤖 AI Optimization</h2>
            <div className="optimization-grid">
              <div className="optimization-card">
                <h3>Model Performance</h3>
                <div className="metric">Accuracy: 94.2%</div>
                <div className="metric">Confidence: 87.5%</div>
                <div className="metric">Active Policy: v2.1</div>
              </div>
              <div className="optimization-card">
                <h3>Traffic Improvement</h3>
                <div className="metric">Travel Time: -12.3%</div>
                <div className="metric">Queue Length: -18.7%</div>
                <div className="metric">Emissions: -8.4%</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Analytics' && (
          <div className="tab-content">
            <h2>📊 Traffic Analytics</h2>
            <div className="analytics-grid">
              <div className="chart-container">
                <TrafficChart 
                  title="Peak Hour Analysis"
                  data={[25, 35, 65, 85, 95, 88, 75, 45, 35, 40, 55, 70]}
                  labels={['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM']}
                  type="line"
                />
              </div>
              <div className="chart-container">
                <TrafficChart 
                  title="Corridor Performance"
                  data={[78, 82, 75, 88, 92, 85, 79, 83, 87, 90, 86, 81]}
                  labels={['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 6', 'Route 7', 'Route 8', 'Route 9', 'Route 10', 'Route 11', 'Route 12']}
                  type="bar"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Assets' && (
          <div className="tab-content">
            <h2>🔧 Asset Health</h2>
            <div className="assets-grid">
              <div className="asset-card">
                <h3>Cameras</h3>
                <div className="asset-stats">
                  <span className="online">12 Online</span>
                  <span className="offline">2 Offline</span>
                </div>
              </div>
              <div className="asset-card">
                <h3>Sensors</h3>
                <div className="asset-stats">
                  <span className="online">28 Online</span>
                  <span className="offline">1 Offline</span>
                </div>
              </div>
              <div className="asset-card">
                <h3>Signals</h3>
                <div className="asset-stats">
                  <span className="online">45 Online</span>
                  <span className="offline">0 Offline</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

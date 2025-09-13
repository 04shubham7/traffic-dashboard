import React, { useState, useEffect, useRef, useCallback } from 'react';
import { mockJunctions, type Junction } from '../../data/mockData';
import './TrafficMap.css';

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

interface TrafficMapProps {
  onJunctionSelect: (junction: any) => void;
  selectedJunction?: string;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ onJunctionSelect, selectedJunction }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<'congestion' | 'queue' | 'speed' | 'incidents'>('congestion');
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);

  // Bangalore city center coordinates
  const bangaloreCenter = [12.9716, 77.5946];

  // Helper functions
  const getJunctionColor = (junction: Junction) => {
    switch (junction.congestionLevel) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSignalIcon = (phase: string) => {
    switch (phase) {
      case 'red': return '🔴';
      case 'yellow': return '🟡';
      case 'green': return '🟢';
      default: return '⚫';
    }
  };

  const addCongestionOverlays = () => {
    if (!mapInstanceRef.current || !window.L) return;
    
    const congestionZones = [
      { center: [12.9716, 77.5946], radius: 500, level: 'high' },
      { center: [12.9352, 77.6245], radius: 400, level: 'medium' },
      { center: [12.9698, 77.7499], radius: 300, level: 'medium' },
      { center: [12.9279, 77.6271], radius: 600, level: 'low' }
    ];

    congestionZones.forEach(zone => {
      const color = zone.level === 'high' ? '#ef4444' : zone.level === 'medium' ? '#f59e0b' : '#10b981';
      const circle = window.L.circle(zone.center, {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: zone.radius,
        weight: 2
      }).addTo(mapInstanceRef.current);
      
      overlaysRef.current.push(circle);
    });
  };

  const addQueueOverlays = () => {
    if (!mapInstanceRef.current || !window.L) return;
    
    mockJunctions.forEach(junction => {
      const queueLength = junction.queueLength;
      const color = queueLength > 100 ? '#ef4444' : queueLength > 50 ? '#f59e0b' : '#10b981';
      
      const bounds = [
        [junction.lat - 0.002, junction.lng - 0.003],
        [junction.lat + 0.002, junction.lng + 0.003]
      ];
      
      const rectangle = window.L.rectangle(bounds, {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 2
      }).addTo(mapInstanceRef.current);
      
      overlaysRef.current.push(rectangle);
    });
  };

  const addSpeedOverlays = () => {
    if (!mapInstanceRef.current || !window.L) return;
    
    mockJunctions.forEach(junction => {
      const speed = junction.avgSpeed;
      const color = speed < 20 ? '#ef4444' : speed < 35 ? '#f59e0b' : '#10b981';
      
      const polygonPoints = [
        [junction.lat + 0.001, junction.lng - 0.002],
        [junction.lat + 0.001, junction.lng + 0.002],
        [junction.lat - 0.001, junction.lng + 0.002],
        [junction.lat - 0.001, junction.lng - 0.002]
      ];
      
      const polygon = window.L.polygon(polygonPoints, {
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2
      }).addTo(mapInstanceRef.current);
      
      overlaysRef.current.push(polygon);
    });
  };

  const addIncidentOverlays = () => {
    if (!mapInstanceRef.current || !window.L) return;
    
    const incidents = [
      { lat: 12.9716, lng: 77.5946, severity: 'critical' },
      { lat: 12.9352, lng: 77.6245, severity: 'medium' },
      { lat: 12.9698, lng: 77.7499, severity: 'low' }
    ];

    incidents.forEach(incident => {
      const color = incident.severity === 'critical' ? '#ef4444' : incident.severity === 'medium' ? '#f59e0b' : '#10b981';
      const emoji = incident.severity === 'critical' ? '🚨' : incident.severity === 'medium' ? '⚠️' : '🚧';
      
      const incidentIcon = window.L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: ${color};
            border: 2px solid #ffffff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          ">
            ${emoji}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      const marker = window.L.marker([incident.lat, incident.lng], {
        icon: incidentIcon
      }).addTo(mapInstanceRef.current);
      
      overlaysRef.current.push(marker);
    });
  };

  const addJunctionMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    mockJunctions.forEach((junction) => {
      // Create custom icon
      const customIcon = window.L.divIcon({
        className: 'custom-junction-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${getJunctionColor(junction)};
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          ">
            ${getSignalIcon(junction.currentPhase)}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = window.L.marker([junction.lat, junction.lng], {
        icon: customIcon
      }).addTo(mapInstanceRef.current);

      // Add popup
      const popupContent = `
        <div style="color: #1a202c; font-family: system-ui; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 16px;">${junction.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${junction.currentPhase}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Queue:</strong> ${junction.queueLength}m</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Speed:</strong> ${junction.avgSpeed}km/h</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Congestion:</strong> ${junction.congestionLevel}</p>
          ${junction.countdown > 0 ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Countdown:</strong> ${junction.countdown}s</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        onJunctionSelect(junction);
      });
      
      // Highlight selected junction
      if (selectedJunction === junction.id) {
        marker.setIcon(window.L.divIcon({
          className: 'custom-junction-marker selected',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background-color: ${getJunctionColor(junction)};
              border: 4px solid #3b82f6;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
            ">
              ${getSignalIcon(junction.currentPhase)}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        }));
      }

      markersRef.current.push(marker);
    });
  }, [onJunctionSelect, selectedJunction]);

  const updateMapOverlays = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing overlays
    overlaysRef.current.forEach(overlay => mapInstanceRef.current.removeLayer(overlay));
    overlaysRef.current = [];

    // Add layer-specific overlays
    switch (mapLayer) {
      case 'congestion':
        addCongestionOverlays();
        break;
      case 'queue':
        addQueueOverlays();
        break;
      case 'speed':
        addSpeedOverlays();
        break;
      case 'incidents':
        addIncidentOverlays();
        break;
    }
  }, [mapLayer]);

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !window.L) {
      return false;
    }

    try {
      // Clear any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY || 'demo_key';
      
      // Create map
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        center: bangaloreCenter,
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${apiKey}`;
      const tileLayer = window.L.tileLayer(tileUrl, {
        attribution: '© <a href="https://www.geoapify.com/">Geoapify</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
        id: 'geoapify-dark'
      });

      tileLayer.addTo(mapInstanceRef.current);
      
      // Add markers and overlays
      addJunctionMarkers();
      updateMapOverlays();
      
      setIsLoading(false);
      setMapError(null);
      return true;
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
      setIsLoading(false);
      return false;
    }
  }, [addJunctionMarkers, updateMapOverlays]);

  // Load Leaflet and initialize map
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadLeaflet = () => {
      // Check if Leaflet is already loaded
      if (window.L && mapContainerRef.current) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);
      }

      // Load Leaflet JS if not already loaded
      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
          timeoutId = setTimeout(() => {
            if (mapContainerRef.current) {
              initializeMap();
            }
          }, 100);
        };
        script.onerror = () => {
          setMapError('Failed to load Leaflet library');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        // Script exists, wait for it to be ready
        timeoutId = setTimeout(() => {
          if (window.L && mapContainerRef.current) {
            initializeMap();
          } else {
            setMapError('Leaflet library not available');
            setIsLoading(false);
          }
        }, 500);
      }
    };

    // Start loading after component mounts
    timeoutId = setTimeout(loadLeaflet, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  // Update markers when selected junction changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      addJunctionMarkers();
    }
  }, [selectedJunction, addJunctionMarkers]);

  // Update overlays when map layer changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapOverlays();
    }
  }, [mapLayer, updateMapOverlays]);

  return (
    <div className="traffic-map">
      <div className="map-controls">
        <div className="layer-controls">
          <button
            className={mapLayer === 'congestion' ? 'active' : ''}
            onClick={() => setMapLayer('congestion')}
          >
            Congestion
          </button>
          <button
            className={mapLayer === 'queue' ? 'active' : ''}
            onClick={() => setMapLayer('queue')}
          >
            Queue Length
          </button>
          <button
            className={mapLayer === 'speed' ? 'active' : ''}
            onClick={() => setMapLayer('speed')}
          >
            Speed
          </button>
          <button
            className={mapLayer === 'incidents' ? 'active' : ''}
            onClick={() => setMapLayer('incidents')}
          >
            Incidents
          </button>
        </div>
      </div>

      <div className="map-container">
        {isLoading && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
        
        {mapError && (
          <div className="map-error">
            <p>⚠️ {mapError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        <div 
          ref={mapContainerRef} 
          className="leaflet-map"
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            <span>High Congestion</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
            <span>Medium Congestion</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            <span>Low Congestion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;

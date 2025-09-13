// Mock data for traffic management dashboard

export interface Junction {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currentPhase: 'red' | 'yellow' | 'green';
  countdown: number;
  queueLength: number;
  avgSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
  aiRecommendation: {
    phase: string;
    duration: number;
    confidence: number;
    expectedImpact: string;
  };
  laneData: {
    north: { count: number; avgSpeed: number };
    south: { count: number; avgSpeed: number };
    east: { count: number; avgSpeed: number };
    west: { count: number; avgSpeed: number };
  };
}

export interface Incident {
  id: string;
  type: 'accident' | 'breakdown' | 'construction' | 'weather';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  eta: string;
  status: 'active' | 'acknowledged' | 'resolved';
  impact: string;
}

export interface KPIData {
  congestionIndex: { value: number; change: number };
  avgDelay: { value: number; change: number };
  activeIncidents: { value: number; medianClearance: number };
  aiImpact: { value: number; description: string };
}

export const mockJunctions: Junction[] = [
  {
    id: 'JN-001',
    name: 'MG Road & Brigade Road',
    lat: 12.9716,
    lng: 77.5946,
    currentPhase: 'green',
    countdown: 45,
    queueLength: 120,
    avgSpeed: 25,
    congestionLevel: 'medium',
    aiRecommendation: {
      phase: 'North-South Priority',
      duration: 60,
      confidence: 0.85,
      expectedImpact: '-22% queue, +8% E-W delay'
    },
    laneData: {
      north: { count: 45, avgSpeed: 22 },
      south: { count: 38, avgSpeed: 28 },
      east: { count: 52, avgSpeed: 18 },
      west: { count: 41, avgSpeed: 24 }
    }
  },
  {
    id: 'JN-002',
    name: 'Koramangala 5th Block',
    lat: 12.9352,
    lng: 77.6245,
    currentPhase: 'red',
    countdown: 25,
    queueLength: 85,
    avgSpeed: 32,
    congestionLevel: 'low',
    aiRecommendation: {
      phase: 'Extended Green',
      duration: 75,
      confidence: 0.92,
      expectedImpact: '-15% delay, +12% throughput'
    },
    laneData: {
      north: { count: 28, avgSpeed: 35 },
      south: { count: 31, avgSpeed: 29 },
      east: { count: 19, avgSpeed: 38 },
      west: { count: 22, avgSpeed: 33 }
    }
  },
  {
    id: 'JN-003',
    name: 'Silk Board Junction',
    lat: 12.9698,
    lng: 77.7499,
    currentPhase: 'yellow',
    countdown: 8,
    queueLength: 200,
    avgSpeed: 12,
    congestionLevel: 'high',
    aiRecommendation: {
      phase: 'Dynamic Timing',
      duration: 90,
      confidence: 0.78,
      expectedImpact: '-35% queue, improved flow'
    },
    laneData: {
      north: { count: 68, avgSpeed: 8 },
      south: { count: 72, avgSpeed: 15 },
      east: { count: 85, avgSpeed: 10 },
      west: { count: 79, avgSpeed: 14 }
    }
  },
  {
    id: 'JN-004',
    name: 'Whitefield Main Road',
    lat: 12.9279,
    lng: 77.6271,
    currentPhase: 'green',
    countdown: 35,
    queueLength: 65,
    avgSpeed: 28,
    congestionLevel: 'low',
    aiRecommendation: {
      phase: 'Standard Cycle',
      duration: 45,
      confidence: 0.88,
      expectedImpact: 'Maintain current flow'
    },
    laneData: {
      north: { count: 25, avgSpeed: 30 },
      south: { count: 22, avgSpeed: 32 },
      east: { count: 18, avgSpeed: 25 },
      west: { count: 20, avgSpeed: 28 }
    }
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    type: 'breakdown',
    location: 'MG Road Junction',
    severity: 'medium',
    description: 'Stalled bus blocking right lane',
    timestamp: '2024-01-15T10:30:00Z',
    eta: '9 min',
    status: 'acknowledged',
    impact: 'Queue +180m, 15% delay increase'
  },
  {
    id: 'INC-002',
    type: 'accident',
    location: 'Silk Board',
    severity: 'high',
    description: 'Two-vehicle collision, emergency services on site',
    timestamp: '2024-01-15T09:45:00Z',
    eta: '25 min',
    status: 'active',
    impact: 'Major congestion, reroute recommended'
  },
  {
    id: 'INC-003',
    type: 'construction',
    location: 'Koramangala 5th Block',
    severity: 'low',
    description: 'Lane closure for utility work',
    timestamp: '2024-01-15T08:00:00Z',
    eta: '2 hours',
    status: 'active',
    impact: 'Minor delays, single lane operation'
  }
];

export const mockKPIs: KPIData = {
  congestionIndex: { value: 38, change: -12 },
  avgDelay: { value: 3.8, change: -14 },
  activeIncidents: { value: 5, medianClearance: 11 },
  aiImpact: { value: 10.7, description: 'faster travel time vs baseline' }
};

export const corridorData = [
  { name: 'MG Road Corridor', travelTime: 12.5, reliability: 0.85, change: -8 },
  { name: 'ORR South', travelTime: 18.2, reliability: 0.72, change: -15 },
  { name: 'Whitefield Route', travelTime: 22.1, reliability: 0.91, change: -5 },
  { name: 'Koramangala Belt', travelTime: 9.8, reliability: 0.88, change: -12 }
];

export const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  baseline: Math.random() * 20 + 15,
  optimized: Math.random() * 15 + 10,
  incidents: Math.floor(Math.random() * 5)
}));

export const deviceHealth = [
  { id: 'CAM-001', type: 'Camera', location: 'MG Road', status: 'online', latency: 45, lastSeen: '2s ago' },
  { id: 'SEN-002', type: 'Sensor', location: 'Silk Board', status: 'online', latency: 32, lastSeen: '1s ago' },
  { id: 'CAM-003', type: 'Camera', location: 'Koramangala', status: 'offline', latency: 0, lastSeen: '5m ago' },
  { id: 'SIG-004', type: 'Signal', location: 'Whitefield', status: 'online', latency: 28, lastSeen: '1s ago' }
];

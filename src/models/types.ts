export type LaunchState =
  | 'SEARCHING_FOR_BALL'
  | 'BALL_FOUND'
  | 'CALIBRATING'
  | 'READY'
  | 'CAPTURING'
  | 'PROCESSING'
  | 'SHOT_COMPLETE'
  | 'ERROR';

export type MeasurementKind = 'MEASURED' | 'CALCULATED' | 'ESTIMATED' | 'UNAVAILABLE';

export type Club =
  | 'Driver'
  | '3 Wood'
  | '5 Wood'
  | '7 Wood'
  | '2 Hybrid'
  | '3 Hybrid'
  | '4 Hybrid'
  | '5 Hybrid'
  | '3 Iron'
  | '4 Iron'
  | '5 Iron'
  | '6 Iron'
  | '7 Iron'
  | '8 Iron'
  | '9 Iron'
  | 'PW'
  | 'GW'
  | 'SW'
  | 'LW'
  | 'Custom';

export interface BallDetection {
  centerX: number;
  centerY: number;
  diameter: number;
  confidence: number;
  stableFrames: number;
}

export interface NativeShotMeasurement {
  ballSpeedMph: number;
  launchAngleDeg: number;
  launchDirectionDeg: number;
  measurementQuality: number;
  framesTracked: number;
  processingTimeMs: number;
  trackingConfidence: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  t: number;
}

export interface Shot {
  id: string;
  shotNumber: number;
  club: Club;
  timestamp: string;
  ballSpeedMph: number;
  launchAngleDeg: number;
  launchDirectionDeg: number;
  carryYards: number;
  measurementQuality: number;
  framesTracked: number;
  trackingConfidence: number;
  processingTimeMs: number;
  trajectory: TrajectoryPoint[];
}

export interface Diagnostics {
  cameraFps: number;
  captureWidth: number;
  captureHeight: number;
  exposureSeconds: number;
  iso: number;
  ballDetected: boolean;
  detectionConfidence: number;
  framesTracked: number;
  trackingConfidence: number;
  rollDeg: number;
  pitchDeg: number;
  calibrationState: string;
  lightingState: 'UNKNOWN' | 'LOW' | 'OK' | 'BRIGHT';
  lightingScore: number;
  measurementQuality: number;
  processingTimeMs: number;
  cameraModel: string;
  state: LaunchState;
  message?: string;
}

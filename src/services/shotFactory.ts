import type { Club, NativeShotMeasurement, Shot } from '../models/types';
import { simulateFlight } from '../physics/trajectory';

export function createShot(
  measurement: NativeShotMeasurement,
  club: Club,
  shotNumber: number
): Shot {
  const flight = simulateFlight(
    measurement.ballSpeedMph,
    measurement.launchAngleDeg,
    measurement.launchDirectionDeg,
    club
  );

  return {
    id: `${Date.now()}-${shotNumber}`,
    shotNumber,
    club,
    timestamp: new Date().toISOString(),
    ballSpeedMph: measurement.ballSpeedMph,
    launchAngleDeg: measurement.launchAngleDeg,
    launchDirectionDeg: measurement.launchDirectionDeg,
    carryYards: flight.carryYards,
    measurementQuality: measurement.measurementQuality,
    framesTracked: measurement.framesTracked,
    trackingConfidence: measurement.trackingConfidence,
    processingTimeMs: measurement.processingTimeMs,
    trajectory: flight.trajectory,
  };
}

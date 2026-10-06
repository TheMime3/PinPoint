import { clubSpinAssumptionRpm } from '../models/clubs';
import type { Club, TrajectoryPoint } from '../models/types';

const MPH_TO_MPS = 0.44704;
const METERS_TO_YARDS = 1.0936133;

type FlightResult = {
  carryYards: number;
  trajectory: TrajectoryPoint[];
};

/**
 * Experimental MVP flight model.
 *
 * Inputs ball speed + launch vector directly measured by the native layer.
 * Because MVP does not measure spin, it uses a club-based spin assumption to
 * produce a usable projected trajectory. That assumption is deliberately
 * isolated here so it can be replaced once spin is measured in a later version.
 *
 * This model is NOT accuracy-validated and must not be used for a public
 * accuracy claim until benchmarked against a trusted launch monitor.
 */
export function simulateFlight(
  ballSpeedMph: number,
  launchAngleDeg: number,
  launchDirectionDeg: number,
  club: Club
): FlightResult {
  const speed = Math.max(0, ballSpeedMph) * MPH_TO_MPS;
  const launch = (launchAngleDeg * Math.PI) / 180;
  const direction = (launchDirectionDeg * Math.PI) / 180;

  let vx = speed * Math.cos(launch) * Math.sin(direction);
  let vy = speed * Math.sin(launch);
  let vz = speed * Math.cos(launch) * Math.cos(direction);

  let x = 0;
  let y = 0.02;
  let z = 0;
  let t = 0;

  const dt = 0.01;
  const massKg = 0.04593;
  const radiusM = 0.021335;
  const area = Math.PI * radiusM * radiusM;
  const airDensity = 1.225;
  const gravity = 9.80665;
  const rpm = clubSpinAssumptionRpm[club];

  // Coefficients are intentionally conservative placeholders for MVP.
  const dragCoefficient = 0.25;
  const liftCoefficient = Math.min(0.28, Math.max(0.08, 0.07 + rpm / 45000));

  const points: TrajectoryPoint[] = [{ x, y, z, t }];
  let nextSample = 0.04;

  for (let i = 0; i < 2500; i += 1) {
    const v = Math.sqrt(vx * vx + vy * vy + vz * vz);
    if (v < 0.1) break;

    const q = 0.5 * airDensity * v * v * area;
    const drag = q * dragCoefficient;
    const lift = q * liftCoefficient;

    const axDrag = -(drag / massKg) * (vx / v);
    const ayDrag = -(drag / massKg) * (vy / v);
    const azDrag = -(drag / massKg) * (vz / v);

    const horizontal = Math.sqrt(vx * vx + vz * vz) || 1;
    const ayLift = (lift / massKg) * (horizontal / v);
    const azLift = -(lift / massKg) * (vy / v) * (vz / horizontal);
    const axLift = -(lift / massKg) * (vy / v) * (vx / horizontal);

    vx += (axDrag + axLift) * dt;
    vy += (ayDrag + ayLift - gravity) * dt;
    vz += (azDrag + azLift) * dt;

    x += vx * dt;
    y += vy * dt;
    z += vz * dt;
    t += dt;

    if (t >= nextSample) {
      points.push({ x, y: Math.max(0, y), z, t });
      nextSample += 0.04;
    }

    if (y <= 0 && t > 0.15) break;
  }

  const carryMeters = Math.sqrt(x * x + z * z);
  return {
    carryYards: Math.max(0, carryMeters * METERS_TO_YARDS),
    trajectory: points,
  };
}

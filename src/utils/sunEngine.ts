import * as SunCalc from "suncalc";

export interface SunPosition {
  azimuth: number;   // in degrees (0-360, 0 is North, 90 is East, 180 is South, 270 is West)
  elevation: number; // in degrees (0-90, above horizon)
}

/**
 * Calculates the sun's azimuth and elevation for a given date, time, and latitude/longitude.
 */
export function calculateSunPosition(
  dateStr: string,
  timeStr: string,
  latitude: number = 13.0827, // Chennai, India as default
  longitude: number = 80.2707
): SunPosition {
  // Parse date and time in local timezone
  const date = new Date(`${dateStr}T${timeStr}:00`);
  const pos = SunCalc.getPosition(date, latitude, longitude);

  return {
    azimuth: pos.azimuth,
    elevation: Math.max(0, pos.altitude), // Clamped to 0 if below the horizon
  };
}

/**
 * Converts azimuth and elevation angles into a normalized 3D Cartesian direction vector [x, y, z].
 * Azimuth: 0 is North (towards -Z), 90 is East (towards +X), 180 is South (towards +Z), 270 is West (towards -X).
 * Elevation: 0 is horizon, 90 is zenith (+Y).
 */
export function getSunDirectionVector(
  azimuth: number,
  elevation: number
): [number, number, number] {
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;

  const y = Math.sin(elevationRad);
  const cosElevation = Math.cos(elevationRad);

  const x = cosElevation * Math.sin(azimuthRad);
  const z = -cosElevation * Math.cos(azimuthRad);

  return [x, y, z];
}

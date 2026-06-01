/** Umbrales de monitoreo (cadena de frío / almacén). Valores fuera → alerta + regularizar. */

export const SENSOR_METRIC_DEFS = [
  { key: 'temperature', field: 'temperature', labelKey: 'sensorTemp', unit: '°C', decimals: 1 },
  { key: 'humidity', field: 'humidity', labelKey: 'sensorHumidity', unit: '% RH', decimals: 1 },
  {
    key: 'light',
    field: 'light_intensity',
    altFields: ['lightIntensity', 'lux'],
    labelKey: 'sensorLight',
    unit: 'LUX',
    decimals: 0,
  },
  { key: 'vibration', field: 'vibration', labelKey: 'sensorVibration', unit: 'm/s²', decimals: 2 },
  { key: 'door', field: 'door_status', altFields: ['doorStatus', 'door'], labelKey: 'sensorDoor', discrete: true },
  {
    key: 'co2',
    field: 'co2',
    altFields: ['air_quality', 'co2_ppm'],
    labelKey: 'sensorCo2',
    unit: 'CO₂ PPM',
    decimals: 0,
  },
  {
    key: 'pressure',
    field: 'atmospheric_pressure',
    altFields: ['pressure'],
    labelKey: 'sensorPressure',
    unit: 'hPa',
    decimals: 1,
  },
  {
    key: 'pm25',
    field: 'pm25',
    altFields: ['pm2_5', 'suspended_particles'],
    labelKey: 'sensorPm25',
    unit: 'PM2.5',
    decimals: 1,
  },
];

const THRESHOLDS = {
  temperature: { min: 2, max: 8, warnBelow: 2.5, warnAbove: 7, safe: 4.5, drift: 0.12 },
  humidity: { min: 35, max: 65, warnBelow: 38, warnAbove: 60, safe: 47, drift: 0.6 },
  light: { min: 0, max: 350, warnAbove: 280, safe: 120, drift: 8 },
  vibration: { min: 0, max: 0.12, warnAbove: 0.08, safe: 0.03, drift: 0.008 },
  co2: { min: 0, max: 900, warnAbove: 700, safe: 420, drift: 12 },
  pressure: { min: 990, max: 1030, warnBelow: 992, warnAbove: 1026, safe: 1013.2, drift: 0.4 },
  pm25: { min: 0, max: 30, warnAbove: 22, safe: 12, drift: 0.5 },
};

export function readDeviceField(dev, def) {
  if (!dev) return null;
  const primary = dev[def.field];
  if (primary != null && primary !== '') return primary;
  for (const alt of def.altFields || []) {
    const v = dev[alt];
    if (v != null && v !== '') return v;
  }
  return null;
}

export function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function evaluateMetric(key, rawValue) {
  if (key === 'door') {
    const door = String(rawValue ?? '').toUpperCase();
    if (!door) return 'unknown';
    if (door.includes('OPEN') || door.includes('ABIERTA')) return 'critical';
    return 'ok';
  }

  const value = num(rawValue);
  if (value == null) return 'unknown';

  const t = THRESHOLDS[key];
  if (!t) return 'ok';

  if (t.max != null && value > t.max) return 'critical';
  if (t.min != null && value < t.min) return 'critical';
  if (t.warnAbove != null && value > t.warnAbove) return 'warning';
  if (t.warnBelow != null && value < t.warnBelow) return 'warning';
  return 'ok';
}

export function isOutOfRange(key, rawValue) {
  const st = evaluateMetric(key, rawValue);
  return st === 'warning' || st === 'critical';
}

export function getSafeValue(key) {
  if (key === 'door') return 'CLOSED';
  return THRESHOLDS[key]?.safe ?? null;
}

export function driftValue(key, current) {
  const t = THRESHOLDS[key];
  if (!t) return current;
  const base = num(current) ?? t.safe;
  let next = base + (Math.random() - 0.48) * t.drift * 2;
  if (t.min != null) next = Math.max(t.min - t.drift * 3, next);
  if (t.max != null) next = Math.min(t.max + t.drift * 4, next);
  const decimals = SENSOR_METRIC_DEFS.find((d) => d.key === key)?.decimals ?? 1;
  return Number(next.toFixed(decimals));
}

export function findMetricDef(key) {
  return SENSOR_METRIC_DEFS.find((d) => d.key === key);
}

export function formatSafeMetricText(key) {
  const def = findMetricDef(key);
  if (!def) return '—';
  return formatMetricText(def, getSafeValue(key));
}

export function formatMetricText(def, rawValue) {
  if (def.discrete) {
    const door = String(rawValue ?? '—');
    return door || '—';
  }
  const value = num(rawValue);
  if (value == null) return '—';
  const decimals = def.decimals ?? 1;
  return `${value.toFixed(decimals)} ${def.unit}`;
}

export function initLiveSnapshot(dev) {
  const snap = {};
  for (const def of SENSOR_METRIC_DEFS) {
    if (def.discrete) {
      snap[def.key] = readDeviceField(dev, def) ?? 'CLOSED';
    } else {
      const v = readDeviceField(dev, def);
      snap[def.key] = v != null && v !== '' ? num(v) : getSafeValue(def.key);
    }
  }
  return snap;
}

export function metricEnabled(def, dev, liveSnap) {
  const enabled = dev?.enabled_sensors;
  if (enabled && typeof enabled === 'object' && enabled[def.key] === false) return false;
  if (def.discrete) return true;
  return liveSnap[def.key] != null;
}

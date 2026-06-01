import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  SENSOR_METRIC_DEFS,
  evaluateMetric,
  isOutOfRange,
  getSafeValue,
  driftValue,
  formatMetricText,
  initLiveSnapshot,
  metricEnabled,
  readDeviceField,
} from './sensor-thresholds.js';

const TICK_MS = 2200;
const REGULARIZE_COOLDOWN_MS = 18000;

export function useLiveSensorReadings(deviceRef, options = {}) {
  const { t } = useI18n();
  const labelPrefix = options.labelPrefix ?? 'monitoring';
  const live = ref({});
  const regularizedUntil = ref({});
  let timer = null;
  let spikeCounter = 0;

  function resetLive(dev) {
    if (!dev) {
      live.value = {};
      regularizedUntil.value = {};
      return;
    }
    live.value = initLiveSnapshot(dev);
    regularizedUntil.value = {};
  }

  watch(
    deviceRef,
    (dev) => {
      resetLive(dev);
    },
    { immediate: true },
  );

  function isRegularized(key) {
    const until = regularizedUntil.value[key];
    return until != null && Date.now() < until;
  }

  function tick() {
    const dev = deviceRef.value;
    if (!dev || !Object.keys(live.value).length) return;

    spikeCounter += 1;
    const snap = { ...live.value };

    for (const def of SENSOR_METRIC_DEFS) {
      if (!metricEnabled(def, dev, snap)) continue;
      if (isRegularized(def.key)) {
        snap[def.key] = getSafeValue(def.key);
        continue;
      }

      if (def.discrete) {
        if (spikeCounter % 25 === 0 && Math.random() < 0.15) {
          snap[def.key] = 'OPEN';
        } else if (spikeCounter % 7 === 0) {
          snap[def.key] = 'CLOSED';
        }
        continue;
      }

      if (spikeCounter % 11 === 0 && def.key === 'temperature' && Math.random() < 0.35) {
        snap[def.key] = Number((8.2 + Math.random() * 1.5).toFixed(1));
      } else if (spikeCounter % 13 === 0 && def.key === 'light' && Math.random() < 0.3) {
        snap[def.key] = Math.round(320 + Math.random() * 120);
      } else {
        snap[def.key] = driftValue(def.key, snap[def.key]);
      }
    }

    live.value = snap;
  }

  function regularize(key) {
    const safe = getSafeValue(key);
    if (safe == null) return;
    live.value = { ...live.value, [key]: safe };
    regularizedUntil.value = {
      ...regularizedUntil.value,
      [key]: Date.now() + REGULARIZE_COOLDOWN_MS,
    };
  }

  const metrics = computed(() => {
    const dev = deviceRef.value;
    if (!dev) return [];

    return SENSOR_METRIC_DEFS.filter((def) => metricEnabled(def, dev, live.value))
      .map((def) => {
        const raw = live.value[def.key] ?? readDeviceField(dev, def);
        const status = evaluateMetric(def.key, raw);
        const out = isOutOfRange(def.key, raw);
        const needsRegularize = out && !isRegularized(def.key);
        const displayStatus = needsRegularize ? status : out ? status : status === 'unknown' ? 'unknown' : 'ok';

        return {
          key: def.key,
          label: t(`${labelPrefix}.${def.labelKey}`),
          text: formatMetricText(def, raw),
          status,
          displayStatus,
          needsRegularize,
          outOfRange: out,
        };
      });
  });

  onMounted(() => {
    timer = setInterval(tick, TICK_MS);
  });

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return {
    metrics,
    regularize,
    live,
  };
}

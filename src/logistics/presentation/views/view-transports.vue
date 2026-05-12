<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchDashboardData } from '../../../shared/infrastructure/services/dashboard.service.js';

const { t } = useI18n();
const transports = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const data = await fetchDashboardData();
    transports.value = data.transports;
  } catch (error) {
    console.error("Error loading transports", error);
  } finally {
    isLoading.value = false;
  }
});

const getTempStatus = (temp) => {
  if (temp > 8) return 'critical';
  if (temp < 0) return 'warning';
  return 'safe';
};

const getTransportIcon = (type) => {
  const t = type.toLowerCase();
  if (t.includes('camión') || t.includes('camioneta')) return 'pi-truck';
  if (t.includes('furgoneta')) return 'pi-car';
  if (t.includes('moto')) return 'pi-directions';
  if (t.includes('dron')) return 'pi-send';
  return 'pi-box';
};

const stats = computed(() => {
  return {
    total: transports.value.length,
    alerts: transports.value.filter(t => t.temperature > 8 || t.door_status === 'OPEN').length
  };
});
</script>

<template>
  <div class="container">
    <!-- TODO: Implementar listado de transportes -->
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
}
</style>
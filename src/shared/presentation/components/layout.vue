<script setup>
import LanguageSwitcher from "./language-switcher.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const userRole = ref(localStorage.getItem('userRole') || 'health-entity');

const isHealthEntity = computed(() => userRole.value === 'health-entity');
const isOperationalStaff = computed(() => userRole.value === 'operational-staff');

const items = computed(() => {
  if (isHealthEntity.value) {
    return [
      { label: 'option.home', to: '/home-health-entity' },
      { label: 'establishment.establishments', to: '/establishment/establishments' },
      { label: 'establishment.assignOperator', to: '/establishment/assign-operator' },
      { label: 'establishment.addEstablishment', to: '/establishment/establishments/new' },
      { label: 'establishment.mapOfEstablishments', to: '/establishment/map' }
    ];
  } else if (isOperationalStaff.value) {
    return [
      { label: 'option.home', to: '/home-operational-staff' },
      { label: 'monitoring.devices', to: '/monitoring/devices' },
      { label: 'logistics.transports', to: '/logistics/transports' },
      { label: 'establishment.operators', to: '/establishment/operators' }
    ];
  }
  return [];
});

const goToProfile = () => {
  router.push({ name: 'profile' });
};
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="layout-wrapper">
    <div class="header">
      <pv-toolbar class="bg-primary">
        <!-- Logo -->
        <template #start>
          <img src="/logo.png" alt="VITAL CARE" class="logo" />
        </template>

        <!-- Navigation items dinámicos según rol -->
        <template #center>
          <div class="flex gap-2">
            <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
              <router-link :to="item.to" :class="slotProps['class']">{{ t(item.label) }}</router-link>
            </pv-button>
          </div>
        </template>

        <!-- Right side: Profile Icon -->
        <template #end>
          <div class="flex gap-3 align-items-center">
            <!-- Profile Icon Button -->
            <button
                class="profile-btn"
                @click="goToProfile"
                title="Profile"
            >
              👤
            </button>
          </div>
        </template>
      </pv-toolbar>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <router-view/>
    </div>

    <!-- Language Switcher Bottom Left -->
    <div class="language-bottom-left">
      <language-switcher/>
    </div>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  height: 40px;
  width: auto;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 120px);
}

.language-bottom-left {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 999;
}

.flex {
  display: flex;
  flex-direction: row;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}

.align-items-center {
  align-items: center;
}

.profile-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0) invert(1);
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

:deep(.p-toolbar) {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

:deep(.p-button-text) {
  color: white;
}

:deep(.p-button-text:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
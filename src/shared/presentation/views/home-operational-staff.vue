<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { readAuthSession } from '../../../iam/application/auth-session.js';
import '../../../establishment/presentation/styles/establishment-flow.css';
import '../styles/home-dashboard.css';

const { t } = useI18n();
const router = useRouter();

const userName = computed(() => readAuthSession()?.name ?? t('layout.guestUser'));
const establishmentName = 'Hospital Central';

const quickActions = [
  {
    titleKey: 'monitoring.devices',
    descKey: 'homeOperational.actionDevicesDesc',
    icon: 'pi pi-box',
    to: '/monitoring/devices',
    tone: 'teal',
  },
  {
    titleKey: 'logistics.transports',
    descKey: 'homeOperational.actionTransportsDesc',
    icon: 'pi pi-truck',
    to: '/logistics/transports',
    tone: 'navy',
  },
  {
    titleKey: 'establishment.operators',
    descKey: 'homeOperational.actionOperatorsDesc',
    icon: 'pi pi-users',
    to: '/establishment/operators',
    tone: 'teal',
  },
];

const navigateTo = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="home-dash-page">
    <section class="est-flow-card home-hero-card">
      <div class="home-hero-card__inner">
        <p class="home-eyebrow">{{ t('common.welcome') }}</p>
        <h1 class="home-title">{{ t('homeOperational.title') }}</h1>
        <p class="home-greeting">
          {{ t('homeOperational.greetingHello') }}
          <strong>{{ userName }}</strong>
          <span class="home-greeting-place">
            {{ t('homeOperational.atEstablishment', { place: establishmentName }) }}
          </span>
        </p>
        <p class="home-subtitle">{{ t('homeOperational.subtitle') }}</p>
      </div>
    </section>

    <div class="home-actions" role="navigation" :aria-label="t('homeOperational.title')">
      <button
        v-for="action in quickActions"
        :key="action.titleKey"
        type="button"
        class="home-action"
        @click="navigateTo(action.to)"
      >
        <span
          class="home-action__icon"
          :class="action.tone === 'teal' ? 'home-action__icon--teal' : 'home-action__icon--navy'"
          aria-hidden="true"
        >
          <i :class="action.icon"></i>
        </span>
        <span class="home-action__body">
          <h2 class="home-action__title">{{ t(action.titleKey) }}</h2>
          <p class="home-action__desc">{{ t(action.descKey) }}</p>
        </span>
        <i class="pi pi-chevron-right home-action__chevron" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

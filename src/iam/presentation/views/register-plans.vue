<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AuthPanel from '../components/auth-panel.vue';
import { saveRegistrationPlan } from '../../application/auth.service.js';
import { readPendingRegistration } from '../../application/auth-session.js';
import { PLAN_CATALOG_ORDER, getPlanByCatalogId } from '../../../subscriptions/application/plan-catalog.js';

const { t } = useI18n();
const router = useRouter();

onMounted(() => {
  if (!readPendingRegistration()) {
    router.replace({ name: 'iam-register-health-entity' });
  }
});

const plans = computed(() =>
  PLAN_CATALOG_ORDER.map((id) => {
    const def = getPlanByCatalogId(id);
    const limits = def.limits;
    return {
      id,
      name: t(`plansPage.names.${id}`),
      price: t(`plansPage.prices.${id}`),
      desc: t(`plansPage.desc.${id}`),
      recommended: def.recommended,
      features: [
        t('plansPage.featureLabels.establishments', { n: limits.establishments }),
        t('plansPage.featureLabels.staticDevices', { n: limits.staticDevices }),
        t('plansPage.featureLabels.vehicleDevices', { n: limits.vehicleDevices }),
        def.customParameters
          ? t('plansPage.featureLabels.customParamsYes')
          : t('plansPage.featureLabels.customParamsNo'),
        t('plansPage.featureLabels.operators'),
        ...(id === 'enterprise' ? [t('plansPage.featureLabels.enterpriseExtras')] : []),
        t('plansPage.featureLabels.reports'),
      ],
    };
  }),
);

function selectPlan(plan) {
  saveRegistrationPlan(plan.id);
  router.push({ name: 'iam-billing' });
}

function goBack() {
  router.push({ name: 'iam-register-health-entity' });
}
</script>

<template>
  <auth-panel show-back single-column wide @back="goBack">
    <div class="reg-plans">
      <header class="reg-plans__head">
        <img src="/logo.png" :alt="t('common.logoAlt')" class="reg-plans__logo" />
        <h1>{{ t('plansPage.title') }}</h1>
        <p>{{ t('plansPage.subtitle') }}</p>
      </header>

      <div class="reg-plans__grid">
        <article
          v-for="plan in plans"
          :key="plan.id"
          class="reg-plans__card"
          :class="{ 'reg-plans__card--featured': plan.recommended }"
        >
          <div class="reg-plans__card-top">
            <span v-if="plan.recommended" class="reg-plans__badge">{{ t('plansPage.recommended') }}</span>
            <h2>{{ plan.name }}</h2>
            <p class="reg-plans__price">{{ plan.price }}</p>
            <p class="reg-plans__desc">{{ plan.desc }}</p>
          </div>
          <ul class="reg-plans__features">
            <li v-for="(f, i) in plan.features" :key="i">{{ f }}</li>
          </ul>
          <button
            type="button"
            class="btn-primary reg-plans__btn"
            @click="selectPlan(plan)"
          >
            {{ t('plansPage.startNow') }}
          </button>
        </article>
      </div>
    </div>
  </auth-panel>
</template>

<style scoped>
.reg-plans {
  width: 100%;
  min-width: 0;
}

.reg-plans__head {
  text-align: center;
  margin-bottom: 1.25rem;
}

.reg-plans__logo {
  width: 56px;
  margin: 0 auto 0.5rem;
  display: block;
}

.reg-plans__head h1 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.reg-plans__head p {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.reg-plans__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.reg-plans__card {
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1.1rem;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.reg-plans__card--featured {
  border-color: #0d9488;
  box-shadow: 0 0 0 1px #0d9488, 0 8px 24px rgba(13, 148, 136, 0.12);
}

.reg-plans__badge {
  display: inline-block;
  margin-bottom: 0.4rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: #0d9488;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.reg-plans__card h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.reg-plans__price {
  margin: 0.35rem 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
}

.reg-plans__desc {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}

.reg-plans__features {
  flex: 1;
  margin: 0.75rem 0;
  padding-left: 1rem;
  font-size: 0.72rem;
  color: #475569;
  line-height: 1.45;
}

.reg-plans__btn {
  margin-top: auto;
}

@media (max-width: 900px) {
  .reg-plans__grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>

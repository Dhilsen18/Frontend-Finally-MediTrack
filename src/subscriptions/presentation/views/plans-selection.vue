<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import {
  readPlanContext,
  writePlanContext,
  apiPlanToCatalogId,
  catalogIdToApiPlan,
} from '../../application/plan-context.js';
import {
  readAuthSession,
  writeAuthSession,
} from '../../../iam/application/auth-session.js';
import useIamStore from '../../../iam/application/iam.store.js';
import MtConfirmDialog from '../../../shared/presentation/components/mt-confirm-dialog.vue';
import { onBeforeRouteLeave } from 'vue-router';

const { t, locale } = useI18n();
const router = useRouter();
const toast = useToast();

const currentCatalogId = ref('basic');
const benefitsEndDate = ref(null);
const cancelOpen = ref(false);
const iamStore = useIamStore();

const planDefs = computed(() => [
  {
    id: 'basic',
    name: t('plansPage.names.basic'),
    price: t('plansPage.prices.basic'),
    desc: t('plansPage.desc.basic'),
    recommended: false,
    features: [
      { ok: true, text: t('plansPage.features.basic.0') },
      { ok: true, text: t('plansPage.features.basic.1') },
      { ok: true, text: t('plansPage.features.basic.2') },
      { ok: true, text: t('plansPage.features.basic.3') },
      { ok: false, text: t('plansPage.features.basic.4') },
      { ok: false, text: t('plansPage.features.basic.5') },
    ],
  },
  {
    id: 'professional',
    name: t('plansPage.names.pro'),
    price: t('plansPage.prices.pro'),
    desc: t('plansPage.desc.pro'),
    recommended: true,
    features: [
      { ok: true, text: t('plansPage.features.pro.0') },
      { ok: true, text: t('plansPage.features.pro.1') },
      { ok: true, text: t('plansPage.features.pro.2') },
      { ok: true, text: t('plansPage.features.pro.3') },
    ],
  },
  {
    id: 'premium',
    name: t('plansPage.names.premium'),
    price: t('plansPage.prices.premium'),
    desc: t('plansPage.desc.premium'),
    recommended: false,
    features: [
      { ok: true, text: t('plansPage.features.premium.0') },
      { ok: true, text: t('plansPage.features.premium.1') },
      { ok: true, text: t('plansPage.features.premium.2') },
      { ok: true, text: t('plansPage.features.premium.3') },
      { ok: true, text: t('plansPage.features.premium.4') },
      { ok: true, text: t('plansPage.features.premium.5') },
    ],
    contactSales: true,
  },
]);

function syncFromSession() {
  const ctx = readPlanContext();
  if (ctx?.catalogPlanId) {
    currentCatalogId.value = ctx.catalogPlanId;
  } else if (ctx?.planApiValue) {
    currentCatalogId.value = apiPlanToCatalogId(ctx.planApiValue);
  }
  benefitsEndDate.value = ctx?.benefitsEndDate ?? null;
}

onMounted(() => {
  syncFromSession();
});

onBeforeRouteLeave(() => {
  cancelOpen.value = false;
});

const formattedBenefitsEnd = computed(() => {
  if (!benefitsEndDate.value) return '—';
  try {
    return new Date(benefitsEndDate.value).toLocaleDateString(
      locale.value === 'es' ? 'es-PE' : 'en-US',
      { day: '2-digit', month: '2-digit', year: 'numeric' },
    );
  } catch {
    return benefitsEndDate.value;
  }
});

const backToProfile = () => {
  router.push({ name: 'profile' });
};

const isCurrent = (id) => id === currentCatalogId.value;

const openCancel = () => {
  cancelOpen.value = true;
};

const closeCancel = () => {
  cancelOpen.value = false;
};

const confirmCancel = () => {
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  const iso = end.toISOString().slice(0, 10);
  const ctx = readPlanContext() || {};
  writePlanContext({
    ...ctx,
    planApiValue: 'BASIC',
    catalogPlanId: 'basic',
    benefitsEndDate: iso,
  });
  const auth = readAuthSession() || {};
  auth.plan = 'BASIC';
  writeAuthSession(auth);
  // actualizar store IAM en memoria para que el perfil refleje el cambio inmediatamente
  try {
    iamStore.profilePlanApi = 'BASIC';
    iamStore.profileBenefitsEndDate = iso;
  } catch (e) {
    // no bloquear si falla (demo)
  }
  currentCatalogId.value = 'basic';
  benefitsEndDate.value = iso;
  cancelOpen.value = false;
  toast.add({
    severity: 'success',
    summary: t('plansPage.cancelSuccessTitle'),
    detail: t('plansPage.cancelSuccessDetail'),
    life: 4000,
  });
};

const selectPlan = (catalogId) => {
  if (isCurrent(catalogId)) return;
  const plan = planDefs.value.find((p) => p.id === catalogId);
  if (plan?.contactSales) {
    toast.add({
      severity: 'info',
      summary: t('plansPage.contactTitle'),
      detail: t('plansPage.contactDetail'),
      life: 4000,
    });
    return;
  }
  const apiVal = catalogIdToApiPlan(catalogId);
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  const iso = end.toISOString().slice(0, 10);
  const ctx = readPlanContext() || {};
  writePlanContext({
    ...ctx,
    planApiValue: apiVal,
    catalogPlanId: catalogId,
    benefitsEndDate: iso,
  });
  const auth = readAuthSession() || {};
  auth.plan = apiVal;
  writeAuthSession(auth);
  try {
    iamStore.profilePlanApi = apiVal;
    iamStore.profileBenefitsEndDate = iso;
  } catch (e) {
    // ignore
  }
  toast.add({
    severity: 'success',
    summary: t('plansPage.planUpdatedTitle'),
    detail: t('plansPage.planUpdatedDetail', { plan: plan?.name ?? '' }),
    life: 3500,
  });
  router.push({ name: 'profile' });
};
</script>

<template>
  <div class="plans-page">
    <nav class="plans-back-bar" aria-label="Navegación">
      <button type="button" class="plans-back-btn" @click="backToProfile">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        <span>{{ t('plansPage.back') }}</span>
      </button>
    </nav>

    <div class="plans-card">
      <header class="plans-head">
        <h1 class="plans-title">{{ t('plansPage.title') }}</h1>
        <p class="plans-subtitle">{{ t('plansPage.subtitle') }}</p>
      </header>

      <div class="plans-grid">
        <article
          v-for="plan in planDefs"
          :key="plan.id"
          class="plan-card"
          :class="{
            'plan-card--current': isCurrent(plan.id),
            'plan-card--recommended': plan.recommended,
          }"
        >
          <div v-if="plan.recommended" class="badge-rec">{{ t('plansPage.recommended') }}</div>
          <h2 class="plan-name">{{ plan.name }}</h2>
          <p class="plan-price">{{ plan.price }}</p>
          <p class="plan-desc">{{ plan.desc }}</p>
          <ul class="plan-features">
            <li v-for="(f, idx) in plan.features" :key="idx" :class="f.ok ? 'ok' : 'no'">
              <i :class="f.ok ? 'pi pi-check' : 'pi pi-times'" aria-hidden="true"></i>
              <span>{{ f.text }}</span>
            </li>
          </ul>
          <div class="plan-actions">
            <template v-if="isCurrent(plan.id)">
              <button type="button" class="plan-btn plan-btn--danger" @click="openCancel">
                <i class="pi pi-times-circle" aria-hidden="true"></i>
                <span>{{ t('plansPage.cancelPlan') }}</span>
              </button>
            </template>
            <template v-else-if="plan.contactSales">
              <button type="button" class="plan-btn plan-btn--ghost" @click="selectPlan(plan.id)">
                <span>{{ t('plansPage.contactSales') }}</span>
                <i class="pi pi-envelope" aria-hidden="true"></i>
              </button>
            </template>
            <template v-else>
              <button type="button" class="plan-btn plan-btn--primary" @click="selectPlan(plan.id)">
                <span>{{ t('plansPage.startNow') }}</span>
                <i class="pi pi-arrow-right" aria-hidden="true"></i>
              </button>
            </template>
          </div>
        </article>
      </div>
    </div>

    <MtConfirmDialog
      v-if="cancelOpen"
      v-model:visible="cancelOpen"
      :eyebrow="t('plansPage.cancelEyebrow')"
      :title="t('plansPage.cancelConfirmTitle')"
      :message="t('plansPage.cancelBenefitsEnd', { date: formattedBenefitsEnd })"
      :confirm-label="t('plansPage.confirm')"
      :cancel-label="t('plansPage.cancel')"
      confirm-tone="danger"
      confirm-icon="pi pi-check"
      @confirm="confirmCancel"
      @cancel="closeCancel"
    />
  </div>
</template>

<style scoped>
.plans-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
}

.plans-back-bar {
  background: #fff;
  border: 1px solid var(--mt-border);
  border-radius: 14px;
  padding: 0.55rem 0.75rem;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.plans-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--mt-primary);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
}

.plans-back-btn:hover {
  background: var(--mt-primary-soft);
  color: var(--mt-primary-hover);
}

.plans-back-btn i {
  font-size: 0.8rem;
}

.plans-card {
  background: #fff;
  border-radius: 22px;
  border: 1px solid var(--mt-border);
  box-shadow: 0 10px 36px rgba(15, 23, 42, 0.07);
  padding: 1.65rem 1.75rem 1.75rem;
}

.plans-head {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--mt-border);
}

.plans-title {
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.65rem);
  font-weight: 800;
  color: var(--mt-heading);
  letter-spacing: -0.03em;
}

.plans-subtitle {
  margin: 0.45rem 0 0;
  font-size: 0.875rem;
  color: var(--mt-text-muted);
  line-height: 1.45;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: stretch;
}

.plan-card {
  position: relative;
  background: #f8fafc;
  border: 1px solid var(--mt-border);
  border-radius: 16px;
  padding: 1.35rem 1.2rem 1.2rem;
  min-height: 26rem;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.plan-card--recommended {
  background: #fff;
  border-color: var(--mt-accent);
  box-shadow: 0 8px 28px rgba(13, 148, 136, 0.12);
}

.plan-card--current {
  border-color: var(--mt-primary);
  box-shadow: 0 8px 28px rgba(30, 58, 138, 0.1);
}

.badge-rec {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
  background: var(--mt-accent);
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
}

.plan-name {
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--mt-heading);
}

.plan-price {
  margin: 0 0 0.65rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--mt-primary);
  letter-spacing: -0.02em;
}

.plan-desc {
  margin: 0 0 0.85rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--mt-text-muted);
}

.plan-features {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  flex: 1;
}

.plan-features li {
  display: flex;
  gap: 0.45rem;
  align-items: flex-start;
  font-size: 0.78rem;
  margin-bottom: 0.4rem;
  line-height: 1.35;
}

.plan-features li.ok {
  color: #15803d;
}

.plan-features li.no {
  color: #94a3b8;
}

.plan-features li i {
  margin-top: 0.08rem;
  font-size: 0.78rem;
  flex-shrink: 0;
}

.plan-actions {
  margin-top: auto;
}

.plan-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.plan-btn:hover {
  transform: translateY(-1px);
}

.plan-btn--primary {
  background: linear-gradient(180deg, #2563eb, var(--mt-primary));
  color: #fff;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.22);
}

.plan-btn--primary:hover {
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.28);
}

.plan-btn--ghost {
  background: #fff;
  color: var(--mt-primary);
  border: 1px solid var(--mt-border);
}

.plan-btn--ghost:hover {
  background: var(--mt-primary-soft);
}

.plan-btn--danger {
  background: #dc2626;
  color: #fff;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.plan-btn--danger:hover {
  background: #b91c1c;
}

@media (max-width: 960px) {
  .plans-card {
    padding: 1.25rem 1rem 1.35rem;
    border-radius: 18px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }

  .plan-card {
    min-height: auto;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { fetchDashboardPayload } from '../../../shared/presentation/composables/use-dashboard-payload.js';
import { readAuthSession } from '../../../iam/application/auth-session.js';
import { normalizeId } from '../../application/operator-roster.js';
import useEstablishmentStore from '../../application/establishment.store.js';
import '../styles/establishment-flow.css';
import '../styles/assign-operator.css';

const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const establishmentStore = useEstablishmentStore();

const users = ref([]);
const establishments = ref([]);
const operators = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const session = ref(null);

const selectedUserIds = ref(new Set());
const selectedEstablishmentId = ref(null);

onMounted(async () => {
  session.value = readAuthSession();
  try {
    const data = await fetchDashboardPayload();
    users.value = data.users || [];
    establishments.value = data.establishments || [];
    operators.value = data.operators || [];
    await establishmentStore.fetchOperatorsAsync();
  } catch (error) {
    console.error('Error loading assignment data', error);
  } finally {
    isLoading.value = false;
  }
});

const scopedEstablishments = computed(() => {
  const adminId = normalizeId(session.value?.adminId);
  if (adminId == null) return establishments.value;
  return establishments.value.filter((e) => normalizeId(e.admin_id) === adminId);
});

const operatorCandidates = computed(() => {
  const code = String(session.value?.entityCode || '').trim().toUpperCase();
  if (!code) return [];
  return (users.value || []).filter((u) => {
    if (String(u.role || '').toUpperCase() !== 'OPERATOR') return false;
    return String(u.entity_code || '').trim().toUpperCase() === code;
  });
});

function getOperatorForUser(userId) {
  const uid = normalizeId(userId);
  return (operators.value || []).find((op) => normalizeId(op.users_id) === uid) ?? null;
}

function establishmentNameForUser(userId) {
  const op = getOperatorForUser(userId);
  if (!op?.establishment_id) return null;
  const est = scopedEstablishments.value.find(
    (e) => normalizeId(e.id) === normalizeId(op.establishment_id),
  );
  return est?.establishment_name ?? null;
}

function isUserSelected(userId) {
  return selectedUserIds.value.has(normalizeId(userId));
}

function toggleUser(userId) {
  const id = normalizeId(userId);
  const next = new Set(selectedUserIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedUserIds.value = next;
}

function selectEstablishment(id) {
  selectedEstablishmentId.value = normalizeId(id);
}

function isEstablishmentSelected(id) {
  return selectedEstablishmentId.value === normalizeId(id);
}

const canConfirm = computed(
  () => selectedUserIds.value.size > 0 && selectedEstablishmentId.value != null,
);

async function confirmAssignment() {
  if (!canConfirm.value || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const userIds = [...selectedUserIds.value];
    await establishmentStore.assignOperatorsToEstablishmentAsync({
      userIds,
      establishmentId: selectedEstablishmentId.value,
    });

    const est = scopedEstablishments.value.find(
      (e) => normalizeId(e.id) === selectedEstablishmentId.value,
    );
    const count = userIds.length;

    toast.add({
      severity: 'success',
      summary: t('establishment.assignSuccess'),
      detail: t('establishment.assignSuccessDetail', {
        count,
        name: est?.establishment_name ?? '',
      }),
      life: 4000,
    });

    selectedUserIds.value = new Set();
    selectedEstablishmentId.value = null;

    operators.value = await establishmentStore.fetchOperatorsAsync();
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: t('establishment.assignError'),
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  const role = localStorage.getItem('userRole');
  if (role === 'health-entity') router.push({ name: 'home-health-entity' });
  else router.push({ name: 'operators' });
}
</script>

<template>
  <div class="est-flow-page">
    <pv-toast />

    <nav class="est-flow-back-bar" aria-label="Navegación">
      <button type="button" class="est-flow-back-btn" @click="goBack">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        <span>{{ t('establishment.assignBack') }}</span>
      </button>
    </nav>

    <div class="est-flow-card">
      <header class="est-flow-head">
        <h1 class="est-flow-title">{{ t('establishment.assignOperator') }}</h1>
        <p class="est-flow-subtitle">{{ t('establishment.assignPageSubtitle') }}</p>
      </header>

      <div v-if="isLoading" class="est-flow-state">
        <i class="pi pi-spin pi-spinner" aria-hidden="true"></i>
        <span>{{ t('establishment.assignLoading') }}</span>
      </div>

      <template v-else>
        <div class="assign-panels">
          <section class="assign-panel" :aria-label="t('establishment.assignOperatorsColumn')">
            <h2 class="assign-panel__head">{{ t('establishment.assignOperatorsColumn') }}</h2>
            <ul v-if="operatorCandidates.length" class="assign-panel__list">
              <li v-for="user in operatorCandidates" :key="user.id" class="assign-panel__row">
                <div class="assign-panel__label">
                  {{ user.name }}
                  <span v-if="establishmentNameForUser(user.id)" class="assign-panel__meta">
                    {{ establishmentNameForUser(user.id) }}
                  </span>
                </div>
                <button
                  type="button"
                  class="assign-select-btn"
                  :class="{ 'assign-select-btn--active': isUserSelected(user.id) }"
                  @click="toggleUser(user.id)"
                >
                  {{
                    isUserSelected(user.id)
                      ? t('establishment.assignSelected')
                      : t('establishment.assignSelect')
                  }}
                </button>
              </li>
            </ul>
            <p v-else class="assign-panel__empty">{{ t('establishment.assignNoOperators') }}</p>
          </section>

          <section class="assign-panel" :aria-label="t('establishment.assignEstablishmentsColumn')">
            <h2 class="assign-panel__head">{{ t('establishment.assignEstablishmentsColumn') }}</h2>
            <ul v-if="scopedEstablishments.length" class="assign-panel__list">
              <li
                v-for="est in scopedEstablishments"
                :key="est.id"
                class="assign-panel__row"
              >
                <label class="assign-panel__label" :for="`est-${est.id}`">
                  {{ est.establishment_name }}
                  <span v-if="est.city_region" class="assign-panel__meta">
                    {{ est.city_region }}{{ est.district ? `, ${est.district}` : '' }}
                  </span>
                </label>
                <input
                  :id="`est-${est.id}`"
                  class="assign-radio"
                  type="radio"
                  name="establishment"
                  :checked="isEstablishmentSelected(est.id)"
                  @change="selectEstablishment(est.id)"
                />
              </li>
            </ul>
            <p v-else class="assign-panel__empty">{{ t('establishment.assignNoEstablishments') }}</p>
          </section>
        </div>

        <footer class="est-flow-actions">
          <button type="button" class="est-flow-btn est-flow-btn--ghost" @click="goBack">
            <i class="pi pi-arrow-left" aria-hidden="true"></i>
            <span>{{ t('establishment.back') }}</span>
          </button>
          <button
            type="button"
            class="est-flow-btn est-flow-btn--accent"
            :disabled="!canConfirm || isSubmitting"
            @click="confirmAssignment"
          >
            <i
              :class="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
              aria-hidden="true"
            ></i>
            <span>{{ isSubmitting ? t('establishment.saving') : t('establishment.assignConfirm') }}</span>
          </button>
        </footer>
      </template>
    </div>
  </div>
</template>

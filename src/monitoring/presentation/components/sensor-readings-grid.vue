<script setup>

import { ref, computed } from 'vue';

import { useI18n } from 'vue-i18n';

import MtConfirmDialog from '../../../shared/presentation/components/mt-confirm-dialog.vue';

import { formatSafeMetricText } from '../../application/sensor-thresholds.js';



defineProps({

  metrics: {

    type: Array,

    default: () => [],

  },

});



const emit = defineEmits(['regularize']);



const { t } = useI18n();



const dialogOpen = ref(false);

const pendingMetric = ref(null);



const dialogMeta = computed(() => {

  if (!pendingMetric.value) return '';

  const safe = formatSafeMetricText(pendingMetric.value.key);

  return t('monitoring.regularizeConfirmMeta', {

    metric: pendingMetric.value.label,

    current: pendingMetric.value.text,

    safe,

  });

});



function iconClass(st) {

  if (st === 'ok') return 'pi pi-check est-flow-metric__icon--ok';

  if (st === 'warning') return 'pi pi-exclamation-triangle est-flow-metric__icon--warn';

  if (st === 'critical') return 'pi pi-times-circle est-flow-metric__icon--critical';

  return 'pi pi-minus est-flow-metric__icon--unknown';

}



function openRegularizeDialog(metric) {

  pendingMetric.value = metric;

  dialogOpen.value = true;

}



function closeDialog() {

  dialogOpen.value = false;

  pendingMetric.value = null;

}



function confirmRegularize() {

  if (!pendingMetric.value) return;

  emit('regularize', pendingMetric.value.key);

  pendingMetric.value = null;

}

</script>



<template>

  <div class="est-flow-fields sensor-readings-grid">

    <div

      v-for="m in metrics"

      :key="m.key"

      class="est-flow-metric"

      :class="{ 'est-flow-metric--alert': m.outOfRange && m.needsRegularize }"

    >

      <span class="est-flow-field__label">{{ m.label }}</span>

      <div

        class="est-flow-metric__body"

        :class="{

          'est-flow-metric__body--warn': m.displayStatus === 'warning',

          'est-flow-metric__body--critical': m.displayStatus === 'critical',

        }"

      >

        <span

          class="est-flow-metric__value"

          :class="{ 'est-flow-metric__value--pulse': m.outOfRange && m.needsRegularize }"

        >

          {{ m.text }}

        </span>

        <div class="est-flow-metric__status">

          <template v-if="m.needsRegularize">

            <i :class="iconClass(m.displayStatus)" aria-hidden="true"></i>

            <button

              type="button"

              class="est-flow-metric__regularize"

              :title="t('monitoring.regularizeMetric')"

              :aria-label="t('monitoring.regularizeAria', { metric: m.label })"

              @click="openRegularizeDialog(m)"

            >

              <i class="pi pi-heart-fill" aria-hidden="true"></i>

            </button>

          </template>

          <i v-else :class="iconClass(m.displayStatus)" aria-hidden="true"></i>

        </div>

      </div>

    </div>

  </div>



  <MtConfirmDialog
    v-if="dialogOpen"
    v-model:visible="dialogOpen"
    :eyebrow="t('monitoring.regularizeEyebrow')"
    :title="t('monitoring.regularizeConfirmTitle')"
    :message="t('monitoring.regularizeConfirmMessage')"
    :meta="dialogMeta"
    :confirm-label="t('monitoring.regularize')"
    :cancel-label="t('monitoring.regularizeCancel')"
    confirm-tone="accent"
    confirm-icon="pi pi-heart-fill"
    :close-aria-label="t('monitoring.regularizeClose')"
    @confirm="confirmRegularize"
    @cancel="closeDialog"
  />

</template>


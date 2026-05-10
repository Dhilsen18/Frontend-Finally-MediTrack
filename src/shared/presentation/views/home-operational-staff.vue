<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();

// TODO: Integrar desde IAM store
const userName = ref('Franco Diego');
const establishmentName = ref('Hospital Central');
</script>

<template>
  <div class="home-container">
    <h1>Operational Staff Home</h1>
    <p>Welcome {{ userName }} to {{ establishmentName }}</p>
    <!-- El contenido lo cambiarás aquí -->
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  min-height: calc(100vh - 120px);
}

h1 {
  color: #000;
}

p {
  color: #000;
}
</style>
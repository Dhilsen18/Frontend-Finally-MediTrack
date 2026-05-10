<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const logout = () => {
  localStorage.removeItem('userRole');
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>{{ t('iam.profile') }}</h1>
      <p>User Profile</p>

      <pv-button
          :label="t('iam.logout')"
          @click="logout"
          icon="pi pi-sign-out"
          class="p-button-danger mt-3"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 2rem;
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.profile-card h1 {
  color: #1a237e;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.mt-3 {
  margin-top: 1rem;
}
</style>
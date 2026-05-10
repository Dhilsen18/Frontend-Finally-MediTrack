<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const selectedRole = ref(null);

const roles = [
  {
    id: 'health-entity',
    label: 'Health Entity',
    icon: 'pi pi-box',
    description: 'Manage establishments and operations'
  },
  {
    id: 'operational-staff',
    label: 'Operational Staff',
    icon: 'pi pi-chart-bar',
    description: 'Monitor devices and transports'
  }
];

const selectRole = (roleId) => {
  selectedRole.value = roleId;
  localStorage.setItem('userRole', roleId);

  if (roleId === 'health-entity') {
    router.push({ name: 'home-health-entity' });
  } else if (roleId === 'operational-staff') {
    router.push({ name: 'home-operational-staff' });
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-form">
        <!-- Logo -->
        <div class="logo-section">
          <h1>MediTrack Sensor</h1>
        </div>

        <!-- Title -->
        <h2 class="form-title">{{ t('login.selectUserType') }}</h2>

        <!-- Role Selection -->
        <div class="roles-grid">
          <div
              v-for="role in roles"
              :key="role.id"
              class="role-card"
              @click="selectRole(role.id)"
          >
            <div class="role-icon">
              <i :class="role.icon"></i>
            </div>
            <h3>{{ role.label }}</h3>
            <p>{{ role.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-wrapper {
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  overflow: hidden;
}

.login-form {
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo-section h1 {
  font-size: 1.8rem;
  color: #1a237e;
  margin: 0;
  font-weight: 700;
}

.form-title {
  font-size: 1.5rem;
  color: #1a237e;
  margin-bottom: 2rem;
  font-weight: 600;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
}

.role-card {
  padding: 2rem;
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.role-card:hover {
  border-color: #ff9800;
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(255, 152, 0, 0.2);
}

.role-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.role-icon i {
  font-size: 2.5rem;
  color: white;
}

.role-card h3 {
  font-size: 1.1rem;
  color: #1a237e;
  margin: 0.5rem 0;
  font-weight: 600;
}

.role-card p {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }

  .login-form {
    padding: 2rem 1rem;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
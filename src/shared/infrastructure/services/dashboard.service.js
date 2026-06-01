import { fetchDashboardPayload } from '../../presentation/composables/use-dashboard-payload.js';

export async function fetchDashboardData() {
    return fetchDashboardPayload();
}
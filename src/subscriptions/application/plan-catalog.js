/**
 * Plan catalog — limits, pricing and capabilities.
 * @module plan-catalog
 */

export const PLAN_CATALOG_ORDER = ['basic', 'premium', 'enterprise'];

export const PLAN_CATALOG = {
    basic: {
        id: 'basic',
        apiPlan: 'BASIC',
        recommended: false,
        limits: { establishments: 5, staticDevices: 40, vehicleDevices: 40 },
        customParameters: false,
    },
    premium: {
        id: 'premium',
        apiPlan: 'PREMIUM',
        recommended: true,
        limits: { establishments: 40, staticDevices: 200, vehicleDevices: 200 },
        customParameters: true,
    },
    enterprise: {
        id: 'enterprise',
        apiPlan: 'ENTERPRISE',
        recommended: false,
        limits: { establishments: 400, staticDevices: 800, vehicleDevices: 800 },
        customParameters: true,
    },
};

export function getPlanByCatalogId(catalogId) {
    const id = String(catalogId || 'basic').toLowerCase();
    return PLAN_CATALOG[id] ?? PLAN_CATALOG.basic;
}

export function apiPlanToCatalogId(apiPlan) {
    const p = String(apiPlan || 'BASIC').toUpperCase();
    const found = PLAN_CATALOG_ORDER.find((id) => PLAN_CATALOG[id].apiPlan === p);
    return found ?? 'basic';
}

export function catalogIdToApiPlan(catalogId) {
    return getPlanByCatalogId(catalogId).apiPlan;
}

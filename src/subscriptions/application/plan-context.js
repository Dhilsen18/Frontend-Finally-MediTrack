/**
 * Plan context helpers (sessionStorage).
 * @module plan-context
 */
import {
    apiPlanToCatalogId,
    catalogIdToApiPlan,
} from './plan-catalog.js';

export { apiPlanToCatalogId, catalogIdToApiPlan };

export const PLAN_CONTEXT_KEY = 'meditrack_plan_context';

export function readPlanContext() {
    try {
        const raw = sessionStorage.getItem(PLAN_CONTEXT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function writePlanContext(ctx) {
    sessionStorage.setItem(PLAN_CONTEXT_KEY, JSON.stringify(ctx));
}

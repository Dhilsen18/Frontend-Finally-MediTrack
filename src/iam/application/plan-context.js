/**
 * Plan context helpers used by IAM profile demo (same session key as Subscriptions).
 *
 * @module plan-context
 */

export const PLAN_CONTEXT_KEY = 'meditrack_plan_context';

export function apiPlanToCatalogId(plan) {
    const p = String(plan || '').toUpperCase();
    if (p === 'BASIC') return 'basic';
    if (p === 'ENTERPRISE') return 'premium';
    if (p === 'PREMIUM') return 'professional';
    return 'basic';
}

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

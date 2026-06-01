/**
 * Builds operator lists scoped to the logged-in health entity admin.
 *
 * @module operator-roster
 */

export function normalizeId(id) {
    if (id == null || id === '') return null;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
}

/**
 * OPERATOR users registered for this entity but without an /operators record yet.
 *
 * @param {{ users: Object[], operators: Object[], entityCode: string|null }} params
 * @returns {Object[]}
 */
export function getPendingOperatorUsers({ users, operators, entityCode }) {
    if (!entityCode) return [];
    const code = String(entityCode).trim().toUpperCase();
    const assignedUserIds = new Set(
        (operators || []).map((op) => normalizeId(op.users_id)).filter((id) => id != null),
    );
    return (users || []).filter((u) => {
        if (String(u.role || '').toUpperCase() !== 'OPERATOR') return false;
        if (String(u.entity_code || '').trim().toUpperCase() !== code) return false;
        return !assignedUserIds.has(normalizeId(u.id));
    });
}

/**
 * Operators assigned to establishments owned by this admin.
 *
 * @param {{ operators: Object[], establishments: Object[], adminId: number|string|null }} params
 * @returns {Object[]}
 */
export function getAssignedOperatorsForAdmin({ operators, establishments, adminId }) {
    if (adminId == null) return operators || [];
    const adminNum = normalizeId(adminId);
    const establishmentIds = new Set(
        (establishments || [])
            .filter((e) => normalizeId(e.admin_id) === adminNum)
            .map((e) => normalizeId(e.id)),
    );
    return (operators || []).filter((op) =>
        establishmentIds.has(normalizeId(op.establishment_id)),
    );
}

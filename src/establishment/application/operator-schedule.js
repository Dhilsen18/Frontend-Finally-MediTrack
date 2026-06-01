/**
 * Formats operator schedule for list/detail display (avoids raw JSON in UI).
 * @param {unknown} schedule
 * @returns {string}
 */
export function formatScheduleSummary(schedule) {
    if (schedule == null || schedule === '') return '—';
    if (typeof schedule === 'string') return schedule;
    if (Array.isArray(schedule)) {
        if (!schedule.length) return '—';
        const first = schedule[0];
        const turn = first?.turn || first?.shift || '';
        const day = first?.day || first?.hours || first?.range || '';
        const line = [turn, day].filter(Boolean).join(' · ');
        if (!line) return '—';
        return schedule.length > 1 ? `${line} (+${schedule.length - 1})` : line;
    }
    if (typeof schedule === 'object') {
        const entries = Object.entries(schedule);
        if (!entries.length) return '—';
        const [turn, day] = entries[0];
        const line = [turn, day].filter(Boolean).join(' · ');
        return entries.length > 1 ? `${line} (+${entries.length - 1})` : line || '—';
    }
    return String(schedule);
}

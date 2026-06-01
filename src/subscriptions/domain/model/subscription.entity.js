/**
 * Subscription value-carrying entity within the Subscriptions bounded context.
 *
 * @class Subscription
 */
export class Subscription {
    /**
     * @param {Object} params - Entity attributes.
     * @param {number|null} [params.id=null] - Subscription identifier.
     * @param {number|null} [params.admin_id=null] - Linked admin identifier.
     * @param {string} [params.plan=''] - Plan tier (BASIC | PREMIUM | ENTERPRISE).
     * @param {string} [params.start_date=''] - Subscription start date.
     * @param {string} [params.end_date=''] - Subscription end date.
     * @param {string} [params.status=''] - Status (ACTIVE | PENDING | EXPIRED).
     * @param {string} [params.created_at=''] - Record creation timestamp.
     */
    constructor({
        id = null,
        admin_id = null,
        plan = '',
        start_date = '',
        end_date = '',
        status = '',
        created_at = '',
    } = {}) {
        this.id = id;
        this.admin_id = admin_id;
        this.plan = plan;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.created_at = created_at;
    }
}

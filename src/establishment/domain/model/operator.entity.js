/**
 * Operator value-carrying entity within the Establishment bounded context.
 *
 * @class Operator
 */
export class Operator {
    /**
     * @param {Object} params - Entity attributes.
     */
    constructor({
        id = null,
        alerts_answered = 0,
        schedule = '',
        establishment_id = null,
        users_id = null,
    } = {}) {
        this.id = id;
        this.alerts_answered = alerts_answered;
        this.schedule = schedule;
        this.establishment_id = establishment_id;
        this.users_id = users_id;
    }
}

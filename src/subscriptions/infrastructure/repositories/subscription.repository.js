import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository.js';
import { SubscriptionsApi } from '../subscriptions-api.js';
import { SubscriptionAssembler } from '../subscription.assembler.js';

/**
 * @class SubscriptionRepository
 * @extends ISubscriptionRepository
 */
export class SubscriptionRepository extends ISubscriptionRepository {
    constructor(api = new SubscriptionsApi()) {
        super();
        this.#api = api;
    }

    #api;

    async findAll() {
        const response = await this.#api.getSubscriptions();
        return SubscriptionAssembler.toEntitiesFromResponse(response);
    }
}

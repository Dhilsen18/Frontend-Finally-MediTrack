/**
 * @interface ISubscriptionRepository
 */
export class ISubscriptionRepository {
    async findAll() {
        throw new Error('ISubscriptionRepository.findAll must be implemented');
    }
}

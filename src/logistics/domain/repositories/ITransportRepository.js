/**
 * @interface ITransportRepository
 */
export class ITransportRepository {
    async findAll() {
        throw new Error('ITransportRepository.findAll must be implemented');
    }
}

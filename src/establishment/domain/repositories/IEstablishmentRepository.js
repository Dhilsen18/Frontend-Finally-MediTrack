/**
 * @interface IEstablishmentRepository
 */
export class IEstablishmentRepository {
    async findAll() {
        throw new Error('IEstablishmentRepository.findAll must be implemented');
    }

    async create(establishment) {
        throw new Error('IEstablishmentRepository.create must be implemented');
    }

    async deleteOperator(id) {
        throw new Error('IEstablishmentRepository.deleteOperator must be implemented');
    }
}

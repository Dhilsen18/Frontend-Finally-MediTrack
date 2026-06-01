/**
 * Repository contract for User persistence (domain layer — no HTTP).
 *
 * @interface IUserRepository
 */
export class IUserRepository {
    /**
     * @returns {Promise<import('../model/user.entity.js').User[]>}
     */
    async findAll() {
        throw new Error('IUserRepository.findAll must be implemented');
    }

    /**
     * @param {number|string} id
     * @returns {Promise<import('../model/user.entity.js').User|null>}
     */
    async findById(id) {
        throw new Error('IUserRepository.findById must be implemented');
    }
}

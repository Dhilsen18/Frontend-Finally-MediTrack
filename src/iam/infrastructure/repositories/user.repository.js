import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IamApi } from '../iam-api.js';
import { UserAssembler } from '../user.assembler.js';

/**
 * Concrete User repository — implements {@link IUserRepository} using IamApi.
 *
 * @class UserRepository
 * @extends IUserRepository
 */
export class UserRepository extends IUserRepository {
    /** @param {IamApi} [api] */
    constructor(api = new IamApi()) {
        super();
        this.#api = api;
    }

    #api;

    async findAll() {
        const response = await this.#api.getUsers();
        return UserAssembler.toEntitiesFromResponse(response);
    }

    async findById(id) {
        const response = await this.#api.getUserById(id);
        if (response.status !== 200) return null;
        return UserAssembler.toEntityFromResource(response.data);
    }
}

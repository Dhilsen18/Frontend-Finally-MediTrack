import { IEstablishmentRepository } from '../../domain/repositories/IEstablishmentRepository.js';
import { EstablishmentApi } from '../establishment-api.js';
import { EstablishmentAssembler } from '../establishment.assembler.js';
import { OperatorAssembler } from '../operator.assembler.js';

/**
 * @class EstablishmentRepository
 * @extends IEstablishmentRepository
 */
export class EstablishmentRepository extends IEstablishmentRepository {
    constructor(api = new EstablishmentApi()) {
        super();
        this.#api = api;
    }

    #api;

    async findAll() {
        const response = await this.#api.getEstablishments();
        return EstablishmentAssembler.toEntitiesFromResponse(response);
    }

    async findOperators() {
        const response = await this.#api.getOperators();
        return OperatorAssembler.toEntitiesFromResponse(response);
    }

    async create(establishment) {
        const response = await this.#api.createEstablishment(establishment);
        return EstablishmentAssembler.toEntityFromResource(response.data);
    }

    async deleteOperator(id) {
        await this.#api.deleteOperator(id);
    }
}

import { ITransportRepository } from '../../domain/repositories/ITransportRepository.js';
import { LogisticsApi } from '../logistics-api.js';
import { TransportAssembler } from '../transport.assembler.js';

/**
 * @class TransportRepository
 * @extends ITransportRepository
 */
export class TransportRepository extends ITransportRepository {
    constructor(api = new LogisticsApi()) {
        super();
        this.#api = api;
    }

    #api;

    async findAll() {
        const response = await this.#api.getTransports();
        return TransportAssembler.toEntitiesFromResponse(response);
    }
}

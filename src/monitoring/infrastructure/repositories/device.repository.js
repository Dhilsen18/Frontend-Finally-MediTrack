import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository.js';
import { MonitoringApi } from '../monitoring-api.js';
import { DeviceAssembler } from '../device.assembler.js';

/**
 * @class DeviceRepository
 * @extends IDeviceRepository
 */
export class DeviceRepository extends IDeviceRepository {
    constructor(api = new MonitoringApi()) {
        super();
        this.#api = api;
    }

    #api;

    async findAll() {
        const response = await this.#api.getDevices();
        return DeviceAssembler.toEntitiesFromResponse(response);
    }
}

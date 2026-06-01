/**
 * @interface IDeviceRepository
 */
export class IDeviceRepository {
    async findAll() {
        throw new Error('IDeviceRepository.findAll must be implemented');
    }
}

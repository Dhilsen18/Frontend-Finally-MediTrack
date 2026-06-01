/**
 * Device (sensor) value-carrying entity within the Monitoring bounded context.
 *
 * @class Device
 */
export class Device {
    /**
     * @param {Object} params - Entity attributes.
     */
    constructor({
        id = null,
        exact_location = '',
        type_of_medication = '',
        temperature = null,
        humidity = null,
        light_intensity = null,
        air_quality = null,
        vibration = null,
        door_status = '',
        atmospheric_pressure = null,
        suspended_particles = null,
        created_at = '',
        updated_at = '',
        establishment_id = null,
    } = {}) {
        this.id = id;
        this.exact_location = exact_location;
        this.type_of_medication = type_of_medication;
        this.temperature = temperature;
        this.humidity = humidity;
        this.light_intensity = light_intensity;
        this.air_quality = air_quality;
        this.vibration = vibration;
        this.door_status = door_status;
        this.atmospheric_pressure = atmospheric_pressure;
        this.suspended_particles = suspended_particles;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.establishment_id = establishment_id;
    }
}

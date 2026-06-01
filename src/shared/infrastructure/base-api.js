import axios from "axios";

const platformApi =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_VITAL_CARE_API_URL ||
    'http://localhost:5000/api/v1';

/**
 * Shared infrastructure base class that creates and exposes a pre-configured Axios instance.
 * All bounded-context API gateways should extend this class.
 *
 * @class BaseApi
 */
export class BaseApi {
    #http;

    /**
     * Initialises the Axios HTTP client with the platform base URL and default headers.
     * @param {string} [baseURL] - Optional API base URL override for bounded-context gateways.
     */
    constructor(baseURL) {
        const resolvedBase = baseURL || platformApi;
        this.#http = axios.create({
            baseURL: resolvedBase,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Exposes the pre-configured Axios instance so subclasses and endpoint clients
     * can attach interceptors or perform requests.
     *
     * @returns {import('axios').AxiosInstance} Configured Axios instance.
     */
    get http() {
        return this.#http;
    }
}
import axios from "axios";

const platformApi =
    import.meta.env.VITE_LEARNING_PLATFORM_API_URL ||
    import.meta.env.VITE_VITAL_CARE_API_URL;

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
     * The base URL is read from `VITE_LEARNING_PLATFORM_API_URL` and falls back to
     * `VITE_VITAL_CARE_API_URL` to keep backward compatibility with current env files.
     */
    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
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
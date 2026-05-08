import en from './locales/en.json';
import es from './locales/es.json';
import {createI18n} from "vue-i18n";

/**
 * Vue I18n instance pre-configured with English and Spanish locale messages.
 * English is used as both the active locale and the fallback locale.
 *
 * @type {import('vue-i18n').I18n}
 */
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {en, es}
});

export default i18n;
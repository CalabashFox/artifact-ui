import i18n from 'i18next';
import cn from './lang/cn.json';
import en from './lang/en.json';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    lng: 'cn',
    resources: {
        en: {
            translation: en
        },
        cn: {
            translation: cn
        }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
        escapeValue: false
    }
});
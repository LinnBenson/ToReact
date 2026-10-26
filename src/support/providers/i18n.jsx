import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import app from '../../config/app.jsx';
import InitProvider from './InitProvider.jsx';

const fallbackLng = Object.hasOwn( app.lang.package, app.lang.default ) ? app.lang.default : Object.keys( app.lang.package )[0];
const files = import.meta.glob('../../lang/*/*.json');

const backend = {
    type: 'backend',
    read( language, namespace, callback ) {
        const path = `../../lang/${language}/${namespace}.json`;
        const load = files[path];
        if ( !load ) {
            callback( new Error(`找不到语言包：${language}/${namespace}` ), false );
            return;
        }
        load()
            .then( async module => {
                callback( null, module.default );
            })
            .catch( error => callback( error, false ));
    }
};

i18n
.use( backend )
.use( initReactI18next )
.init({
    lng: InitProvider.getSetLang(),
    fallbackLng: fallbackLng,
    defaultNS: 'base',
    supportedLngs: Object.keys( app.lang.package ),
    interpolation: { escapeValue: false },
    ns: app.lang.ns,
});

export default i18n;

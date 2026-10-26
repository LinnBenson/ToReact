import app, { allowUpdateAppKey, mustUserKeys } from "../../config/app";
import { theme, themes, themeVersion } from "../../config/theme";
import common, { storage } from "../helpers/common";

/**
 * 初始化服务
 */
const InitProvider = {
    /**
     * 获取用户唯一标识
     * @returns {UUID} 用户唯一标识
     */
    initRid: () => {
        const saved = storage.get( 'rid' );
        if ( common.is_uuid( saved ) ) { return saved; }
        const rid = common.uuid();
        storage.set( 'rid', rid );
        return rid;
    },
    /**
     * 获取设置的语言
     * @returns {string} 语言键名
     */
    getSetLang: () => {
        const languages = app.lang.package;
        const languageKeys = Object.keys( languages );
        const saved = storage.get( 'locale' );
        // 优先使用用户已经选择的语言
        if ( typeof saved === 'string' && Object.hasOwn( languages, saved ) ) {
            return saved;
        }
        // 按浏览器偏好顺序匹配语言
        const browserLanguages = typeof navigator !== 'undefined' ? ( navigator.languages ?? [ navigator.language ] ) : [];
        for ( const browserLanguage of browserLanguages ) {
            if ( typeof browserLanguage !== 'string' ) { continue; }
            // 精确匹配，例如 zh-CN
            const exactLanguage = languageKeys.find(
                key => key.toLowerCase() === browserLanguage.toLowerCase()
            );
            if ( exactLanguage ) { return exactLanguage; }
            // 基础语言匹配，例如 en-US 匹配 en
            const baseLanguage = browserLanguage.split( '-' )[0].toLowerCase();
            const matchedLanguage = languageKeys.find(
                key => key.toLowerCase() === baseLanguage
            );
            if ( matchedLanguage ) { return matchedLanguage; }
        }
        // 浏览器语言不可用时使用项目默认语言
        if ( Object.hasOwn( languages, app.lang.default ) ) {
            return app.lang.default;
        }
        // 默认语言也无效时使用第一个语言包
        return languageKeys[0];
    },
    /**
     * 获取设置的应用核心配置
     * @returns {object} 应用核心配置
     */
    getSetApp: () => {
        const saved = storage.get( 'app' );
        if ( common.empty( saved ) || typeof saved !== 'object' || Array.isArray( saved ) ) {
            return app;
        }
        const appConfig = { ...app };
        for ( const key of allowUpdateAppKey ) {
            if ( Object.hasOwn( saved, key ) && typeof saved[key] === typeof app[key] ) {
                appConfig[key] = saved[key];
            }
        }
        return appConfig;
    },
    /**
     * 获取当前用户实例
     * @returns {object|null} 当前用户信息，若未登录则返回 null
     */
    getSetUser: () => {
        const saved = storage.get( app.userSave );
        if ( common.empty( saved ) || typeof saved !== 'object' || Array.isArray( saved ) ) {
            return null;
        }
        const missingKey = mustUserKeys.find( key => !Object.hasOwn( saved, key ) );
        if ( missingKey ) { return null; }
        return saved;
    },
    /**
     * 获取设置的主题包
     * @returns {object} 主题包数据
     */
    getSetThemes: () => {
        const saved = storage.get( 'themes' );
        if ( common.empty( saved ) || typeof saved !== 'object' || Array.isArray( saved ) ) {
            return themes;
        }
        if ( !Object.hasOwn( saved, 'version' ) || saved.version !== themeVersion ) {
            storage.remove( 'themes' );
            return themes;
        }
        delete saved.version;
        if ( common.empty( saved ) ) {
            storage.remove( 'themes' );
            return themes;
        }
        const verifyKey = [ "icon", "logo", "img", "style", "--r0", "--r1", "--r2", "--r2c", "--r3", "--r3c", "--r4", "--r4c", "--r5", "--r5c", "--r6", "--font", "--radius" ];
        for( const item of Object.values( saved ) ) {
            if ( common.empty( item ) || typeof item !== 'object' || Array.isArray( item ) ) { return themes; }
            if ( !verifyKey.every( key => Object.hasOwn( item, key ))) {
                return themes;
            }
        }
        return saved;
    },
    /**
     * 获取设置的主题
     * @returns {string} 主题名称
     */
    getSetTheme: () => {
        const availableThemes = InitProvider.getSetThemes();
        const saved = storage.get( 'theme', theme );
        if ( typeof saved === 'string' && Object.hasOwn( availableThemes, saved ) ) { return saved; }
        return Object.hasOwn( availableThemes, theme ) ? theme : Object.keys(availableThemes)[0];
    },
    /**
     * 设置网站主题信息
     * @param {{ th: object }} options 当前主题配置
     * @returns {boolean} 是否成功设置
     */
    resize: () => {
        document.documentElement.style.setProperty( '--vw', `${window.innerWidth}px` );
        document.documentElement.style.setProperty( '--vh', `${window.innerHeight}px` );
    },
    setWebsiteTheme: ({ th }) => {
        const link = document.getElementById( 'theme-style' );
        if ( link ) {
            if ( th.style ) { link.setAttribute( 'href', th.style ); } else { link.removeAttribute( 'href' ); }
        }
        Object.entries( th ).forEach(([ name, value ]) => {
            if ( name.startsWith( '--' ) ) {
                document.documentElement.style.setProperty( name, value );
            }
        });
        InitProvider.resize();
        window.addEventListener( 'resize', InitProvider.resize );
    },
    /**
     * 从服务器刷新配置信息
     * @param {{ request: object }} options 请求对象
     */
    refreshIndex: ({ request, setApp, setThemes, user, setUser }) => {
        request.build( 'index' ).success(( res ) => {
            const data = res.data ?? {};
            if ( !common.empty( data.system ) && typeof data.system === 'object' ) {
                setApp( data.system );
            }
            if ( !common.empty( data.themes ) && typeof data.themes === 'object' ) {
                setThemes( data.themes );
            }
            if ( data.user === null || typeof data.user === 'object' ) {
                if ( typeof data.user === 'object' && !common.empty( user ) && common.empty( data.user.token ) ) {
                    data.user.token = user.token;
                }
                setUser( data.user );
            }
        }).send();
    }
};

export default InitProvider;
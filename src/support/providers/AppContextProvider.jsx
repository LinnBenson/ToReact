import { useCallback, useEffect, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import InitProvider from './InitProvider.jsx';
import common, { storage } from '../helpers/common.jsx';
import appDefault, { allowUpdateAppKey, mustUserKeys } from '../../config/app.jsx';
import { theme as themeDefault, themes as themesDefault, themeVersion } from '../../config/theme.jsx';

/**
 * 应用核心上下文
 */
const AppContextProvider = ({ children }) => {
    // 初始化应用唯一标识和核心配置
    const [ rid ] = useState( InitProvider.initRid );
    // 应用核心配置
    const [ app, setApp ] = useState( InitProvider.getSetApp );
    /**
     * 调试函数
     */
    const debug = useCallback(( ...info ) => {
        if ( app.debug ) { console.log( ...info ); }
    }, [ app.debug ]);
    /**
     * 应用核心配置更新方法
     */
    const setAppMethod = useCallback(( data ) => {
        if ( !data || typeof data !== 'object' || Array.isArray( data ) ) { return; }
        setApp(( previous ) => {
            const allowedData = Object.fromEntries(
                Object.entries( data ).filter(([ key ]) => allowUpdateAppKey.includes( key ))
            );
            const next = { ...previous, ...allowedData };
            if ( common.allowUpdate( previous, next ) ) { return next; }
            // debug( 'Refuse to update', previous, data );
            return previous;
        });
    }, []);
    useEffect(() => {
        const current = storage.get( 'app' );
        const saved = Object.fromEntries(
            allowUpdateAppKey.filter( key => !Object.is( app[key], appDefault[key] ) ).map( key => [ key, app[key] ] )
        );
        if ( Object.keys( saved ).length === 0 ) {
            if ( current !== null ) { storage.remove( 'app' ); }
            return;
        }
        if ( !common.isEqual( current, saved ) ) {
            storage.set( 'app', saved );
        }
    }, [ app ]);
    // 本地化语言设置
    const [ locale, setLocale ] = useState( InitProvider.getSetLang );
    /**
     * 设置当前使用语言
     */
    const setLocaleMethod = useCallback(( name ) => {
        const languages = app.lang.package;
        if ( typeof name !== 'string' || !Object.hasOwn( languages, name ) ) {
            // debug( 'Refuse to update locale', name );
            return false;
        }
        setLocale(( previous ) => previous === name ? previous : name );
        return true;
    }, [ app.lang.package ]);
    // 主题设置
    const [ theme, setTheme ] = useState( InitProvider.getSetTheme );
    // 可用主题列表
    const [ themes, setThemes ] = useState( InitProvider.getSetThemes );
    /**
     * 主题包更新方法
     */
    const setThemesMethod = useCallback(( data ) => {
        if ( !data || typeof data !== 'object' || Array.isArray( data ) ) { return; }
        const allowedData = Object.fromEntries(
            Object.entries( data ).filter(([ key ]) => key !== 'version' )
        );
        setThemes(( previous ) => {
            if ( common.allowUpdate( previous, allowedData ) ) { return allowedData; }
            // debug( 'Refuse to update', previous, data );
            return previous;
        });
    }, []);
    useEffect(() => {
        const stored = storage.get( 'themes' );
        const current = stored && typeof stored === 'object' && !Array.isArray( stored )
            ? Object.fromEntries(
                Object.entries( stored ).filter(([ key ]) => key !== 'version' )
            )
            : null;
        if ( common.isEqual( themes, themesDefault ) ) {
            if ( stored !== null ) { storage.remove( 'themes' ); }
            return;
        }
        if ( !common.isEqual( current, themes ) ) {
            storage.set( 'themes', { ...themes, version: themeVersion } );
        }
    }, [ themes ]);
    /**
     * 设置当前使用主题
     */
    const setThemeMethod = useCallback(( name ) => {
        if ( typeof name !== 'string' || !Object.hasOwn( themes, name ) ) {
            // debug( 'Refuse to update theme', name );
            return false;
        }
        setTheme(( previous ) => previous === name ? previous : name );
        return true;
    }, [ themes ]);
    /**
     * 校正当前主题
     * 主题包更新后，优先使用默认主题，否则使用第一个可用主题。
     */
    useEffect(() => {
        if ( Object.hasOwn( themes, theme ) ) { return; }
        const firstTheme = Object.keys( themes )[0];
        const nextTheme = Object.hasOwn( themes, themeDefault ) ? themeDefault : firstTheme;
        if ( typeof nextTheme === 'string' ) { setTheme( nextTheme );  }
    }, [ themes, theme ]);
    // 当前用户实例
    const [ user, setUser ] = useState( InitProvider.getSetUser );
    /**
     * 用户实例更新方法
     */
    const setUserMethod = useCallback(( data ) => {
        if ( data === null ) { setUser( null ); return true; }
        if ( typeof data !== 'object' || Array.isArray( data ) ) { return false; }
        // 必须包含的用户键名
        const missingKey = mustUserKeys.find( key => !Object.hasOwn( data, key ) );
        if ( missingKey ) {
            // debug( 'Missing required user key', missingKey );
            return false;
        }
        setUser(( previous ) => {
            if ( previous === null ) { return data; }
            if ( common.allowUpdate( previous, data ) ) { return data; }
            return previous;
        });
        return true;
    }, []);
    useEffect(() => {
        if ( user === null ) {
            storage.remove( app.userSave );
        }else {
            storage.set( app.userSave, user );
        }
    }, [ user ]);
    /**
     * 设置当前页面标题
     */
    const setTitle = useCallback(( title ) => {
        title = title ?? '';
        if ( typeof title !== 'string' && !Array.isArray( title ) ) {
            debug( 'Refuse to update title', title );
            return false;
        }
        if ( Array.isArray( title ) ) { title = title.join( app.titleJoin ); }
        title = title.trim();
        document.title = `${title && title !== '' ? `${title}${app.titleJoin}` : ''}${app.name}`;
        return true;
    }, [ app, debug ]);
    // 共享参数引用
    const shareRef = useRef({ init: false });
    const readyCallbacks = useRef([]);
    /**
     * 延时触发
     */
    const ready = useCallback(( func ) => {
        if ( typeof func !== 'function' ) { return false; }
        if ( shareRef.current.init ) { func(); return true; }
        readyCallbacks.current.push(func);
        return true;
    }, []);
    /**
     * 共享参数使用器
     */
    const share = useCallback(( key ) => { return shareRef.current[key]; }, []);
    const setShare = useCallback(( key, value ) => {
        shareRef.current[key] = value;
        if ( key === 'init' && value === true ) {
            ( readyCallbacks.current.splice( 0 ) ).forEach(func => func());
        }
        return shareRef.current[key];
    }, []);

    return (
        <AppContext value={{
            rid,
            app, setApp: setAppMethod,
            locale, setLocale: setLocaleMethod,
            theme, setTheme: setThemeMethod,
            themes, setThemes: setThemesMethod, th: ( themes[theme] ?? {} ),
            user, setUser: setUserMethod,
            setTitle,
            debug, ready, share, setShare
        }}>
            {children}
        </AppContext>
    );
}

export default AppContextProvider;
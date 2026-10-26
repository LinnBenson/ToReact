import { useEffect, useCallback } from 'react'
import '../support/library/reset.css'
import '../support/library/unit.css'
import '../support/library/cards.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import useAppContext from './context/AppContext.jsx'
import InitProvider from './providers/InitProvider.jsx'
import i18n from './providers/i18n.jsx'
import { storage } from './helpers/common.jsx'
import appConfig from '../config/app.jsx'
import { theme as themeDefault } from '../config/theme.jsx'
import RouterProvider from './providers/RouterProvider.jsx'
import useUnitContext from './context/UnitContext.jsx'

/**
 * 渲染主应用程
 */
const Root = () => {
    const { debug, locale, theme, themes, th, setShare, setApp, setThemes, user, setUser } = useAppContext();
    const { request } = useUnitContext();
    // 挂载网站信息
    useEffect(() => {
        InitProvider.setWebsiteTheme({ th });
        if ( theme === themeDefault ) { storage.remove( 'theme' ); }else { storage.set( 'theme', theme ); }
    }, [ theme, themes ]);
    useEffect(() => {
        i18n.changeLanguage( locale );
        document.documentElement.lang = locale;
        if ( locale === appConfig.lang.default ) { storage.remove( 'locale' ); }else { storage.set( 'locale', locale ); }
    }, [ locale ]);
    // 从服务器刷新
    const refreshIndex = useCallback(() => {
        return InitProvider.refreshIndex({ request, setApp, setThemes, user, setUser });
    }, [ request, setApp, setThemes, setUser ]);
    useEffect(() => {
        refreshIndex();
        const interval = setInterval( refreshIndex, 15000 );
        return () => clearInterval( interval );
    }, [ refreshIndex ]);

    // 标记初始化完成
    useEffect(() => { setShare( 'init', true ); }, [ setShare ]);

    debug( "[Root] 根组件刷新" );
    return (<>
        <RouterProvider></RouterProvider>
    </>);
};

export default Root;
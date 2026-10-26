import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter } from 'react-router'
import app from './config/app.jsx'
import AppContextProvider from './support/providers/AppContextProvider.jsx'
import UnitContextProvider from './support/providers/UnitContextProvider.jsx'
import Root from './support/Root.jsx'
import repair from './config/repair.jsx';

/**
 * 配置并启用 Mock 网络请求
 */
if ( import.meta.env.DEV && import.meta.env.VITE_DEV_MOCK === 'true' ) {
    const { network } = await import( 'virtual:msw' );
    const handlerModules = import.meta.glob( './mocks/handlers/**/*.{js,jsx}', { import: 'default' } );
    const moduleHandlers = await Promise.all(
        Object.values( handlerModules ).map( load => load() )
    );
    const handlers = moduleHandlers.flat();
    network.configure({ handlers, context: { quiet: true }, onUnhandledFrame: ( { frame, defaults } ) => {
        if ( frame.protocol !== 'http' ) { defaults.warn(); return; }
        const pathname = new URL( frame.data.request.url ).pathname;
        // 页面和静态资源请求直接放行
        if ( !pathname.startsWith( '/api/' ) ) { return; }
        // 未匹配的接口请求继续显示警告
        defaults.warn();
    }});
    await network.enable();
}
/**
 * 运行修复程序
 */
repair.forEach(fn => fn && fn());
/**
/**
 * 渲染节点
 */
const AppRouter = app.routerWay === 'HashRouter' ? HashRouter : BrowserRouter;
createRoot(document.getElementById( 'root' )).render(
//    <StrictMode>
        <AppContextProvider>
            <UnitContextProvider>
                <AppRouter basename={app.routerWay === 'HashRouter' ? undefined : app.base}>
                    <Root />
                </AppRouter>
            </UnitContextProvider>
        </AppContextProvider>
//    </StrictMode>
);

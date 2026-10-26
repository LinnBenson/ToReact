import { lazy, useMemo } from 'react';
import { matchRoutes, useLocation } from "react-router";
import routes from '../../config/router';

/**
 * 页面懒加载配置
 * ---
 * 非懒加载的资源应该在此处排除
 */
const pages = import.meta.glob([
    '../../views/**/*.jsx',
    '!../../views/Index.jsx',
    '!../../views/HasError.jsx'
]);

const delay = import.meta.env.DEV ? Math.max( 0, Number( import.meta.env.VITE_DEV_LOAD_DELAY ) || 0 ) : 0;
const waitForLoad = () => delay > 0 ? new Promise( resolve => setTimeout( resolve, delay ) ) : Promise.resolve();

/**
 * 加载路由页面
 * @param {string} name 页面路径名称
 * @returns {object} React lazy 组件
 */
const load = ( name ) => {
    const loader = pages[`../../views/${name}.jsx`];
    if ( !loader ) { throw new Error( `[${name}] 页面不存在` ); }

    return lazy( async () => {
        const module = await loader();
        await waitForLoad();
        return module;
    });
}

/**
 * 获取当前匹配的路由配置
 * @returns {{ route: object|null, params: object }} 当前路由信息
 */
const useCurrentRoute = () => {
    const location = useLocation();

    return useMemo( () => {
        const match = matchRoutes( routes, location )?.at( -1 );

        return {
            route: match?.route || null,
            params: match?.params || {}
        };
    }, [ location.pathname ] );
};

export { waitForLoad, useCurrentRoute };
export default load;
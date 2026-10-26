import RouterLoader from "../support/components/RouterLoader";
import HasError from "../support/components/HasError";

/**
 * 应用核心配置
 */
const app = {
    // 调试模式
    debug: import.meta.env.VITE_APP_DEBUG === 'true',
    // 应用名称
    name: import.meta.env.VITE_APP_NAME,
    // 应用时区
    timezone: import.meta.env.VITE_APP_TIMEZONE,
    // 应用基础 URL
    base: import.meta.env.VITE_APP_BASE_URL,
    // 多语言配置
    lang: {
        default: import.meta.env.VITE_APP_LANG,
        package: {
            'zh-CN': "简体中文",
            'en': "English"
        },
        ns: import.meta.env.VITE_APP_LANG_NS ? import.meta.env.VITE_APP_LANG_NS.split( ',' ) : []
    },
    // 应用版权信息
    copyright: import.meta.env.VITE_APP_COPYRIGHT,
    // 页面标题连接符
    titleJoin: ' - ',
    // 路由方式
    routerWay: import.meta.env.VITE_APP_ROUTER_WAY,
    // 路由加载器
    routerFallback: RouterLoader, // 首次加载或页面组件挂起时使用
    routerLoader: RouterLoader, // 保留旧页面并进行路由切换时使用
    // 错误页面模版 ({ code: 404, message: 'Not found.' })
    errorPage: HasError,
    userSave: 'user'
};
// 可更新的应用核心配置键名
const allowUpdateAppKey = [ 'debug', 'name', 'timezone', 'copyright' ];
// 用户信息中必须存在的键名
const mustUserKeys = [ 'uid', 'username', 'nickname', 'level', 'token' ];

export { allowUpdateAppKey, mustUserKeys };
export default app;
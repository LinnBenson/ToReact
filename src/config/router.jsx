import { Outlet } from 'react-router';
import app from './app';
import DefaultFrame from '../frames/DefaultFrame';
import PaperFrame from '../frames/PaperFrame';

const routerModules = import.meta.glob(
    '../router/**/*.jsx',
    { eager: true, import: 'default' }
);

/**
 * 路由框架配置
 * ---
 * 配置格式:
 * - 键名：路由框架名称，路由未指定 frame 时使用 default
 * - 值：React 组件类型
 * - Outlet：渲染匹配的子路由
 * - 函数组件、类组件、memo()、forwardRef()、lazy()：作为框架组件渲染
 * - load() 返回值：作为 lazy 组件渲染
 *
 * 组件接收:
 * - isPending: [boolean] 指示路由切换过渡状态
 */
const frames = {
    default: DefaultFrame,
    paper: PaperFrame,
    blank: Outlet
};

/**
 * 路由配置
 * ---
 * 配置格式:
 * - title: [string|array] 路由标题, array 将传递给 t() 本地化语言处理
 * - path: [string] 路由路径
 * - component: [React 组件] 路由对应的组件
 * - frame: [string] 使用的路由框架
 * - auth: [boolean|string|function|React 元素] 路由守卫
 * - props: [object] 传递给组件的额外属性
 *
 * 路由守卫[auth]:
 * - auth({ ...props: [object]路由配置额外属性, app: [object]应用核心配置, user: [object]当前用户信息, setUser: [function] 设置用户信息 }) => 返回布尔值、字符串或 React 元素
 * - true：允许访问
 * - null|undefined：拒绝访问并渲染 204 页面
 * - false：拒绝访问并渲染 403 页面
 * - string：重定向到指定地址，并使用 replace
 * - React 元素：直接渲染该元素
 * - 函数组件、类组件、lazy 组件：作为组件渲染
 * - load() 返回值：作为 lazy 组件渲染
 *
 * 组件接收[component]:
 * - isPending: [boolean] 指示路由切换过渡状态
 * - ...props: [object] 路由对象传递的额外属性
 */
const routes = [
    ...Object.values( routerModules ).flat(),
    { title: null, path: '/access/guard/204', component: app.errorPage, frame: 'blank', props: { code: '403', message: 'No Content.' } },
    { title: null, path: '/access/guard/403', component: app.errorPage, frame: 'blank', props: { code: '403', message: 'Authorization failed.' } },
    { title: null, path: '*', component: app.errorPage, frame: 'blank', props: { code: '404', message: 'Not found.' } }
];

export { frames };
export default routes;

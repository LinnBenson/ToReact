import { isValidElement } from 'react';
import { Navigate } from 'react-router';
import useAppContext from '../context/AppContext';

function AccessGuard({ children, isPending, router, ...props }) {
    const { app, user, setUser } = useAppContext();

    if ( typeof router?.auth === 'function' ) {
        const auth = router.auth({ ...props, app, user, setUser });
        // 如果 auth 返回的是字符串，则表示需要重定向
        if ( typeof auth === 'string' ) {
            return <Navigate to={`${auth}`} replace />;
        }
        // 如果 auth 返回的是 false|null，则表示授权失败
        if ( auth === null || auth === undefined ) { return <Navigate to='/access/guard/204' replace />; }
        if ( auth === false ) { return <Navigate to='/access/guard/403' replace />; }
        // 如果 auth 返回组件或者 lazy 组件，则直接渲染
        if ( isValidElement( auth ) ) { return auth; }
        if ( typeof auth === 'function' || auth?.$$typeof === Symbol.for('react.lazy') ) {
            const AuthComponent = auth;
            return <AuthComponent {...props} isPending={isPending} />;
        }
    }
    // 访问通过
    return children;
}

export default AccessGuard;